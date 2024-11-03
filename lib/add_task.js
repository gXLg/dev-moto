const fs = require("fs");

module.exports = r => {
  const name = r.body.name;
  const skills = r.body.skills.split(/,[ ]*/).map(i => parseInt(i));
  let f;
  try {
    f = fs.readFileSync("./data/tasks.json", "utf-8");
  } catch {
    f = "[]";
  }
  let j;
  if (name.startsWith("-")) {
    const remove = name.slice(1).split(/,[ ]*/).map(i => parseInt(i));
    j = JSON.parse(f).filter(e => !remove.includes(e.id));
  } else {
    j = JSON.parse(f);
    const entry = { name, skills, "id": (j.slice(-1)[0]?.id ?? 0) + 1 };
    j.push(entry);
  }
  const s = JSON.stringify(j);
  fs.writeFileSync("./data/tasks.json", s);
};
