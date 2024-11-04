d => "<table><tr><th>Day</th><th>Time</th><th>Activity</th>" +
  d.map(p => {
    const n = new Date();
    const d = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][n.getDay()];
    let c = "";
    if (d == p.day) {
      c = " style='background-color: lightgray;";
      const [h1, m1, h2, m2] = p.time.match(/\d\d/).map(i => parseInt(i));
      const h = n.getHours();
      const m = n.getMinutes();

      const [t1, t, t2] = [h1 * 60 + m1, h * 60 + m, h2 * 60 + m2];

      if (t1 <= t && t <= t2) c += " color: green;";
      c += "'";
    }
    return "<tr" + c + "><td>" + p.day + "</td><td>" + p.time + "</td><td>" + p.name + "</td></tr>";
  }).join("\n") + "</table>";
