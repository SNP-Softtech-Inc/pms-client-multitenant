// The documents tree refreshes quickly, so a document the firm uploads shows
// up within seconds. Checked in the source, the way the admin app checks its
// own tree; commented-out lines are ignored.
const fs = require("fs");
const path = require("path");

const liveSource = (file) =>
  fs
    .readFileSync(path.join(__dirname, file), "utf8")
    .split(/\r?\n/)
    .filter((line) => !line.trim().startsWith("//"))
    .join("\n");

describe("documents tree auto refresh", () => {
  const src = liveSource("DocsFolderTree.js");

  it("uses the quick interval, imported from the shared rules", () => {
    expect(src).toMatch(/import \{ keepIfSame, QUICK_INTERVAL_MS \} from "\.\.\/lib\/autoRefresh";/);
    expect(src).toMatch(/useAutoRefresh\(refreshTreeQuietly, \{\s*intervalMs: QUICK_INTERVAL_MS,\s*enabled:/);
  });

  it("sets the tree only when it changed", () => {
    expect(src).toMatch(/setFolderTree\(keepIfSame\(res\.data\.contents\)\)/);
  });
});
