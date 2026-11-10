import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const catalog = readFileSync("src/components/QRSolutions/utralinkTemplates.ts", "utf8");
const page = readFileSync("src/components/QRSolutions/QRSolutionsPage.tsx", "utf8");
const entries = [...catalog.matchAll(/"preview_url": "(https:\/\/utralink\.com\/[a-z0-9]{6})"/g)].map((m) => m[1]);
const categories = [...catalog.matchAll(/"category": "([^"]+)"/g)].map((m) => m[1]);
assert.equal(entries.length, 82, "Exactly 82 real template URLs must be present");
assert.equal(new Set(entries).size, 82, "Template URLs must be unique");
assert.equal(new Set(categories).size, 12, "Templates must be organized into 12 categories");
assert.match(page, /import \{ UTRALINK_TEMPLATES \}/, "QR Solutions must use the catalog");
assert.match(page, /visibleTemplates\.map\(\(template\) => \(/, "Every template must render in its own frame");
assert.match(page, /src=\{template\.preview_url \?\? undefined\}/, "Each frame must use its own template URL");
console.log("QR Solutions catalog verified: 82 unique URLs, 12 categories, connected iframe.");
