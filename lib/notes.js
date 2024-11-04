const fs = require("fs");

module.exports = req => {
  if (req.auth == null) return;
  const username = req.auth;

  try {
    return fs.readFileSync("./data/" + username + "_notes.md", "utf8");
  } catch {
    return "(No notes yet)";
  }
};
