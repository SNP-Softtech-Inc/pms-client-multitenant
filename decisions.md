# Decisions

Why things were done the way they were. A diff shows *what* changed; this
records *why*, and what was rejected.

Newest first. Add an entry when a reader would otherwise ask "why was it done
this way?" — not for routine edits. Update it in the same commit as the code.

---

## 2026-10-29 · v1.16.0 · staging only

### Auto refresh on every data screen, through one shared hook

Same mechanism as the admin app (v1.63.0 there); the files are copies, as
the two apps share no code.

**One shared mechanism.** `src/lib/autoRefresh.js` (`startAutoRefresh`,
`keepIfSame`) and `src/hooks/useAutoRefresh.js`. Every 30 seconds while the
tab is visible, and at once on return to the tab or window; nothing while
hidden; never two requests at once; a failed refresh is logged and the next
one still runs; nothing below 5 seconds is accepted. Before this, each screen
that refreshed had its own copy of a setInterval block, with no overlap guard
- and most screens had none, which is why it "worked on some screens".

**Quiet, or not at all.** A screen's normal load usually shows a spinner,
toasts on failure, or clears the list on error. Called every 30 seconds that
would blink the page, stack error toasts, or - where the spinner replaces the
page - unmount an open dialog. So each screen refreshes through a silent path:
no spinner, no toast, a failure keeps what is shown.

**`keepIfSame`.** A quiet refresh hands back the current object when the
server's answer is identical, so React does not re-render. Without it the
shared table jumps back to page 1 every 30 seconds, and chat views scroll to
the bottom.

**Paused while the user is working.** Each screen passes `enabled: false`
while a form, drawer, dialog, signature, upload or save is open or running.

**Where it lives matters here:**
- Home does not refresh as a whole - its loader swaps every list for a
  skeleton, unmounting an open organizer, proposal signature or DocuSeal
  iframe. Each Home list refreshes itself instead.
- The documents and trash screens declare their real UI as a component
  inside another. Any outer state change (setError, a toast) remounts it and
  wipes what the client has open, so the refresh lives in the inner component
  and only ever sets the tree.
- The DocuSeal signer's load replaced the whole panel with a spinner,
  signing dialog included; its quiet path never sets loading and pauses while
  any signing, viewing, payment or cancel dialog is open.

**Not refreshed, on purpose:** PayInvoice (the credit and amount due would
change while the client is paying); Payment's invoice summary (its loader is
meant to PATCH overdue statuses); the auth screens.

**Chat:** UpdateChat's own 15s poll moved onto the hook, which adds the
overlap guard and refresh-on-focus it lacked.

**Also:** QuickLinks and Invoice now store `[]` when the server sends no list,
so a refresh cannot crash their `.reduce` / `.filter`.

**Pre-existing, found on the way, not changed:** DocsFolderTree calls an
undefined `setFolderUploadDrawerOpen` (the "upload folder" action);
Payment.js calls an undefined `isInvoiceOverdue`; PayInvoice.js holds a
hardcoded AffiniPay key - for the security review.

---

## 2026-10-24 · Test harness (staging only)

### A static guard against module-scope hooks

The only test here was Create React App boilerplate asserting the app
renders a "learn react" link. It does not — the test had been failing
silently because nobody ran it. Removed.

**What replaced it: `src/__tests__/noModuleScopeHooks.test.js`**, the same
guard added to the admin app. It parses all 126 source files with
`@babel/parser` and fails any `use*` call with no function parent.

**Why this one first:** a hook at module scope throws on *import*, so it
does not break one screen — it kills every route, as a white page, while
the build still succeeds. That outage happened in the admin app (v1.48.0),
caused by an edit anchored on text that matched a commented-out copy of the
component. This app has its own large files — `DocsFolderTree.js` at 2,675
lines and `FolderTreeView.js` at 2,624 — so the same mistake is available
here.

**Why static rather than a render test:** no provider tree to construct, it
covers every file rather than the few a render test reaches, and it runs in
seconds. Five self-tests prove the detector actually detects, so a green run
means something.

### Render and component tests are likely blocked here too

The admin app hit a chain of failures attempting an import smoke test:
`react-router-dom@7`'s `main` field points at a file that does not exist,
CRA 5's jest 27 cannot read exports maps, jsdom lacks `TextEncoder`, and
then an untransformed ESM dependency. This app is on `react-router-dom@7.5.3`
and the same CRA version, so expect the same.

That work was not repeated here, since nothing yet needs it. If a component
test is wanted, read the admin app's decisions.md first — the first three
steps are already solved there and can be copied.

---

## v1.15.0 · `c406ef8`

### Report bulk trash honestly instead of claiming success

**Decision:** render per-document outcomes for a bulk trash operation rather
than a single success banner.

**Reasoning:** trashing touches two stores — files on disk and rows in Mongo
— and either can fail independently. A single aggregate success hid partial
failures: documents stayed where they were while the UI said they had been
trashed. Clients then saw contradictory state and retried, which is how this
was reported in the first place.

**Tradeoff accepted:** the UI has to render partial outcomes, which is more
work than a banner. The honest version is harder to build and far less
confusing to use.

**Server-side counterpart:** folder-mangement v1.6.0 made the same change at
the API layer. The two were needed together — an honest API is no use behind
a UI that collapses the result.

---

## v1.14.0 · `a9c21d3`

### Mark sealed documents with a Sealed tag again

A regression: the Sealed tag had stopped appearing on documents that were
sealed. Restored.

**Why it matters more here than in the admin app:** this is the portal
clients see. A signed-and-sealed document that does not show as sealed looks
unfinished to the person who just signed it.

---

## Architecture

### Context only — no Redux, no React Query

**Decision:** state is React Context. The provider stack is `BrowserRouter →
ToastProvider → AuthProvider` and nothing else.

**Reasoning:** this app has a narrower job than the admin application — a
client views their documents, invoices, organizers and messages. There is
little cross-screen shared state to justify a store.

**Tradeoff accepted:** no normalised cache, so some screens refetch data the
previous one already had.

**Explicitly not copied from the admin app:** it runs Redux Toolkit, React
Query *and* Context simultaneously, with nothing documenting which owns
what. That is a cost, not a pattern. Adding a second state system here needs
a reason worth writing in this file.

### Document management is a separate implementation

`src/docs-management/` duplicates, rather than shares, the admin app's
document tree — about 5,300 lines across `DocsFolderTree.js` and
`FolderTreeView.js`.

**Why it is separate:** the two portals show different actions to different
audiences. Clients do not get the admin's full action set.

**The cost, and it is real:** a document fix in the admin app does **not**
reach here. When a document bug is reported, establish which portal it was
seen in before investigating — that has already cost a round of work in the
wrong application.

---

## Standing constraints

### No secret may appear in a `REACT_APP_*` variable

Everything prefixed `REACT_APP_` is compiled into the bundle. In this app
that bundle is served to the firm's **clients**, so the audience for any leak
is external. `DOCUSEAL_API_KEY` stays server-side in esignature-backend.

### `DISABLE_ESLINT_PLUGIN=true` in the build is a hazard

Set in `package.json` because the build otherwise fails on pre-existing lint
errors. It also suppresses `no-undef`, so an undefined identifier compiles
cleanly and fails at runtime.

### Capture the real exit code when building

Piping the build through `tail` reports `tail`'s exit status, always 0, so a
failed build looks successful.

---

## Known issues, not yet fixed

| issue | detail |
|---|---|
| `ProtecteRoute.js` is misspelled | Missing the `d`. Searching `ProtectedRoute` finds nothing. Internal, so renameable. |
| Duplicate env vars for one backend | `REACT_APP_AUTH_USER` / `REACT_APP_USER_LOGIN`, and `REACT_APP_PROPOSAL` / `REACT_APP_PROPOSAL_URL`. Two names for one target invites them drifting to different values. |
| Document code duplicated from the admin app | ~5,300 lines maintained separately. Fixes do not cross over. |
| `DISABLE_ESLINT_PLUGIN=true` | Suppresses `no-undef`; undefined identifiers reach production. |
| Hardcoded production URL fallbacks | Of the form `process.env.X \|\| "https://www.snptaxes.com/..."`. A missing variable silently targets production instead of failing. |
