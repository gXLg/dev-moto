const fs = require("fs");

module.exports = req => {
  const task = parseInt(req.body.task);
  const reff = req.body.effects;
  const [start, duration] = req.body.time.split("+").map(i => parseInt(i));

  const eff = [];
  for (const e of reff.split(/,[ ]*/)) {
    const [i, d] = e.split(/[+-]/).map(i => parseInt(i));
    if (e.includes("+")) eff.push([i, d]);
    else if (e.includes("-")) eff.push([i, -d]);
  }

  let j;
  try {
    const f = fs.readFileSync("./data/status.json");
    j = JSON.parse(f);
  } catch {
    j = [];
  }
  for (const [status, delta] of eff) {
    const s = j.find(s => s.id == status);
    if (s == null) continue;
    s.stat += delta;
  }
  fs.writeFileSync("./data/status.json", JSON.stringify(j));

  try {
    const f = fs.readFileSync("./data/times.json");
    j = JSON.parse(f);
  } catch {
    j = { };
  }

  if (!(task in j)) j[task] = { };
  for (const [status, delta] of eff) {
    const idelta = delta / duration;
    if (!(status in j[task])) j[task][status] = {};
    for (let i = start; i <= start + duration; i += 30) {
      const rtime = i % 1440;
      const time = rtime - (rtime % 30);
      const [value, differ] = j[task][status][time] ?? [0, 0];
      j[task][status][time] = [value + idelta, differ + 1];
    }
  }
  fs.writeFileSync("./data/times.json", JSON.stringify(j));

  try {
    const f = fs.readFileSync("./data/tasks.json");
    j = JSON.parse(f);
  } catch {
    return;
  }
  const t = j.find(t => t.id == task);
  if (t == null) return;
  const skills = t.skills;

  try {
    const f = fs.readFileSync("./data/skills.json");
    j = JSON.parse(f);
  } catch {
    j = [];
  }
  for (const s of skills) {
    const k = j.find(k => k.id == s);
    if (k == null) continue;
    k.prof ++;
  }
  fs.writeFileSync("./data/skills.json", JSON.stringify(j));
};
