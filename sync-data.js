/////////////////////////////////////////////////////////////
// Regenerates assets/js/data.js from the JSON files in /data.
//
// Why this file exists:
//   Browsers block fetch() of local files (CORS) when a page is
//   opened directly from disk (file://), so "Preview index.html by
//   double-clicking it" cannot load ./data/*.json at runtime.
//   assets/js/data.js is an embedded copy of the same data that is
//   loaded with a normal <script> tag, which always works.
//   The site still fetches the original JSON when served over HTTP
//   (local server / GitHub Pages), so deploy behavior is unchanged.
//
// Data source of truth: /data/*.json (edit these)
// Usage:                node sync-data.js   (or double-click Sync-Data.bat)
/////////////////////////////////////////////////////////////

"use strict";

const { readFile, writeFile } = require("fs/promises");
const path = require("path");

const DATA_FILES = {
  services: "data/services.json",
  testimonials: "data/testimonials.json",
  projects: "data/projects.json",
  posts: "data/posts.json",
  educations: "data/educations.json",
  experiences: "data/experiences.json",
};

const TARGET = path.join(__dirname, "assets", "js", "data.js");

const HEADER = `///////////////////////////////////////////////////////////
// AUTO-GENERATED FILE - do not edit by hand.
// Source of truth: /data/*.json - regenerate with:  node sync-data.js
// This embedded copy is used only when index.html is opened from
// disk (file://); over HTTP the page still fetches /data/*.json.
///////////////////////////////////////////////////////////

`;

(async () => {
  const entries = [];

  for (const [key, file] of Object.entries(DATA_FILES)) {
    const raw = await readFile(path.join(__dirname, file), "utf8");
    const parsed = JSON.parse(raw); // also validates the file's syntax
    if (parsed === null) {
      throw new Error(`${file} is empty`);
    }
    entries.push(`  ${key}: ${JSON.stringify(parsed, null, 2)}`);
    console.log(`OK  ${file}`);
  }

  await writeFile(TARGET, `${HEADER}window.PORTFOLIO_DATA = {\n${entries.join(",\n\n")}\n};\n`, "utf8");
  console.log(`\nWrote ${path.relative(__dirname, TARGET)}`);
})().catch((error) => {
  console.error("Sync failed:", error.message);
  process.exitCode = 1;
});
