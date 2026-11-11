/**
 * Utility script to bundle index.html + styles.css + config.js + app.js
 * into google-apps-script/Index.html for single-click Google Apps Script hosting.
 *
 * Run: node build-gas.js
 */
const fs = require("fs");
const path = require("path");

const root = __dirname;
const indexHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
const stylesCss = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const configJs = fs.readFileSync(path.join(root, "config.js"), "utf8");
const appJs = fs.readFileSync(path.join(root, "app.js"), "utf8");

let bundled = indexHtml
  .replace(
    '<link rel="stylesheet" href="styles.css" />',
    () => `<style>\n${stylesCss}\n</style>`
  )
  .replace(
    '<script src="config.js"></script>\n  <script src="app.js"></script>',
    () => `<script>\n${configJs}\n\n${appJs}\n</script>`
  );

const outPath = path.join(root, "google-apps-script", "Index.html");
fs.writeFileSync(outPath, bundled, "utf8");
console.log("Generated:", outPath);
