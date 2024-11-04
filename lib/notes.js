const fs = require("fs");

module.exports = () => {
  try {
    return fs.readFileSync("./data/notes.md", "utf8");
  } catch {
    return "(No notes yet)";
  }
};
