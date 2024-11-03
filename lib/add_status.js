const fs = require("fs");

module.exports = r => {
  const name = r.body.name;
  let f;
  try {
    f = fs.readFileSync("./data/status.json", "utf-8");
  } catch {
    f = "[]";
  }
  let j;
  if (name.startsWith("-")) {
    const remove = name.slice(1).split(/,[ ]*/).map(i => parseInt(i));
    j = JSON.parse(f).filter(e => !remove.includes(e.id));
  } else {
    j = JSON.parse(f);
    const entry = { name, "id": (j.slice(-1)[0]?.id ?? 0) + 1, "stat": 0 };
    j.push(entry);
  }
  const s = JSON.stringify(j);
  fs.writeFileSync("./data/status.json", s);
};
