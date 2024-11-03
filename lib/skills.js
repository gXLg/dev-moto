const fs = require("fs");

module.exports = () => {
  try {
    const f = fs.readFileSync("./data/skills.json", "utf-8");
    return JSON.parse(f);
  } catch {
    return [];
  }
};
