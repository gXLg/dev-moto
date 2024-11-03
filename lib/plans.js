const fs = require("fs");

module.exports = req => {
  try {
    const c = JSON.parse(fs.readFileSync("./data/current_plan.json"));
    const t = JSON.parse(fs.readFileSync("./data/tasks.json"));
    const cc = {
      "message": c.message,
      "plan": c.plan.sort((p1, p2) => {
        const t1 = p1.day + p1.start;
        const t2 = p2.day + p2.start;
        if (t1 < t2) return -1;
        else return 1;
      }).map(p => {
        const { day, start, duration, task } = p;
        const name = t.find(tt => tt.id == task).name;

        const [h, m] = start.split(":").map(i => parseInt(i));
        const f = (h * 60 + m + duration) % 1440;
        const stop = [parseInt(f / 60), f % 60].map(s => s.toString().padStart(2, "0")).join(":");

        return {
          "day": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][p.day],
          "time": start + " - " + stop,
          "task": name
        };
      })
    };
    return cc;
  } catch {
    return { "message": "Error", "plan": [] };
  }
};
