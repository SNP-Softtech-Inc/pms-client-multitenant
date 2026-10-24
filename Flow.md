# Flow

How execution moves through this app. Reasoning behind changes belongs in
[decisions.md](./decisions.md).

The **client portal** — the view the firm's clients use. The admin app is a
separate application (`pms-frontend-multitenant`), served at `/admin`.

Package name is `mui-client-dashboard`; it is served under `/client`
(`"homepage": "/client"`).

---

## Entry point

**`src/index.js`** → `src/App.js`.

The provider stack is deliberately much thinner than the admin app's:

```
ReactDOM.createRoot(#root)
  BrowserRouter        basename={process.env.REACT_APP_BASE_PATH}
    ToastProvider      src/hooks/useToast
      AuthProvider     src/context/Context.js
        <App />
```

No Redux, no React Query, no MUI `ThemeProvider` at the root — theming comes
from `src/shared-theme/`. State is **Context only**. Do not add Redux here
without a reason worth writing down; the admin app's three-system split is a
cost, not a model to copy.

Route protection is `src/context/ProtecteRoute.js` — spelled as shown
(missing `d`), which is why searching `ProtectedRoute` finds nothing.

---

## The API layer

```
component
  └─► src/services/api.js      one module, every backend
        └─► HTTP → nginx → the service
```

A single `api.js` with no separate interceptor module — the admin app splits
this into `api.js`, `apiInterceptor.js` and `tokenService.js`. Auth handling
lives inline here.

Backends reached, each behind its own environment variable:

```
REACT_APP_AUTH_USER / REACT_APP_USER_LOGIN   signup-login-backend
REACT_APP_ACCOUNT_CONTACT                    account-contact-backend
REACT_APP_ACCOUNT_TASKS                      account-task-backend
REACT_APP_CHAT                               chat-backend
REACT_APP_EMAIL_SYNC                         signup-login-backend (/api/emailsync)
REACT_APP_ESIGNATURE_API                     esignature-backend
REACT_APP_FOLDER_MANAGEMENT                  folder-mangement
REACT_APP_CLIENT_DOCS_MANAGE                 folder-mangement (client docs)
REACT_APP_INVOICE                            invoice-backend
REACT_APP_JOBS                               jobs-backend
REACT_APP_ORGANIZER                          organizer-backend
REACT_APP_PROPOSAL / REACT_APP_PROPOSAL_URL  proposal-backend
REACT_APP_SIDEBAR                            client-sidebar-backend (port 8012)
REACT_APP_TEMPLATE                           templates-backend
REACT_APP_ACCOUNTS_URL  REACT_APP_SERVER_URI
REACT_APP_BASE_PATH                          router basename
```

Note `REACT_APP_SIDEBAR` points at **client-sidebar-backend** (8012), not the
admin `sidebar-backend` (8024). Different service, different store.

Several backends are reachable through two variables
(`REACT_APP_AUTH_USER` / `REACT_APP_USER_LOGIN`, `REACT_APP_PROPOSAL` /
`REACT_APP_PROPOSAL_URL`). Check which one a call site uses before changing
either.

**No secret may be referenced here.** Everything prefixed `REACT_APP_` is
compiled into the bundle and readable by any client who loads the page —
which in this app means the firm's customers.

---

## Documents

`src/docs-management/` is the client-facing document tree, parallel to the
admin app's `AccountDashboard/Documents`. The two have diverged and are
maintained separately:

```
docs-management/DocsFolderTree.js    2,675 lines
docs-management/FolderTreeView.js    2,624 lines
```

A document fix in the admin app does **not** reach here. When a document bug
is reported, establish which portal it was seen in first — that has already
cost a round of investigation in the wrong application.

---

## Build

```bash
DISABLE_ESLINT_PLUGIN=true NODE_OPTIONS=--max-old-space-size=4096 \
  CI=false npx react-scripts build
```

4 GB heap here, against the admin app's 8 GB — this app is roughly half the
size (125 source files against 292).

`DISABLE_ESLINT_PLUGIN=true` suppresses `no-undef`, so undefined identifiers
compile cleanly and fail at runtime. And when checking a build, **capture the
real exit code** — piping through `tail` reports `tail`'s status, which is
always 0.

---

## Directory map

```
src/
  index.js            provider stack, router
  App.js              routes
  Dashboard.js  Navbar.js
  pages/              feature screens
  docs-management/    client document tree (separate from the admin app's)
  components/         shared components
  context/            Context.js (auth), ProtecteRoute.js, ShortcutContext.jsx
  hooks/              incl. useToast
  shared-theme/       MUI theming
  internals/
  services/api.js     single API module
  login-signup/       auth screens
  TextEditor/         CKEditor wrappers
  lib/  Images/
```
