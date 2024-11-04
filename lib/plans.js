const fs = require("fs");

module.exports = req => {
  try {
    return JSON.parse(fs.readFileSync("./data/current_plan.json")).timetable;
  } catch {
    return [];
  }
};
