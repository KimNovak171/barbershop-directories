const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(process.cwd(), "out");

/**
 * Recursively walk `dir`, delete files ending in .txt (any case) except robots.txt (any case).
 */
function walkAndCleanTxt(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkAndCleanTxt(full);
      continue;
    }
    if (!entry.isFile()) continue;

    const lower = entry.name.toLowerCase();
    if (!lower.endsWith(".txt")) continue;
    if (lower === "robots.txt") continue;

    try {
      fs.unlinkSync(full);
    } catch {
      // ignore per-file errors; build should not fail on cleanup
    }
  }
}

if (!fs.existsSync(OUT_DIR)) {
  process.exit(0);
}

walkAndCleanTxt(OUT_DIR);
process.exit(0);
