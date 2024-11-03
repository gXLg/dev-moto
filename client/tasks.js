d => "<table><tr><th>ID</th><th>Name</th><th>Skills</th></tr>" +
  d.map(
  ({ name, id, skills }) =>
    "<tr><td>" + id + "</td><td>" + name + "</td><td>" + skills.join(", ") + "</td></tr>"
  ).join("\n") +
"</table>";
