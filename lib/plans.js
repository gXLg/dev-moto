const fs = require("fs");

module.exports = req => {
  if (req.auth == null) return;
  const username = req.auth;

  try {
    return JSON.parse(fs.readFileSync("./data/" + username + "_current_plan.json")).timetable;
  } catch {
    return [];
  }
};
