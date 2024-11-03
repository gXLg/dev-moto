d => "<div><b>" + d.message + "</b></div><table>" +
  "<tr><th>Day</th><th>Time</th><th>Task</th>" +
  d.plan.map(p =>
    "<tr><td>" + p.day + "</td><td>" + p.time + "</td><td>" + p.task + "</td></tr>"
  ).join("\n") + "</table>";
