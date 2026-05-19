const fs = require("fs");
const path = require("path");

function fixContent(content) {
  return content
    .split("</motion>")
    .join("</div>")
    .split("<motion>")
    .join("<div>")
    .split("<motion ")
    .join("<div ");
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (!fullPath.endsWith(".tsx")) continue;
    const original = fs.readFileSync(fullPath, "utf8");
    const updated = fixContent(original);
    if (updated !== original) {
      fs.writeFileSync(fullPath, updated);
      console.log("fixed:", fullPath);
    }
  }
}

walk(path.join(__dirname, "..", "app"));
walk(path.join(__dirname, "..", "components"));
walk(path.join(__dirname, "..", "components", "skeletons"));
