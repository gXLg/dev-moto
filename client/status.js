d => "<table><tr><th>ID</th><th>Name</th><th>Status</th></tr>" +
  d.map(
  ({ name, id, stat }) =>
    "<tr><td>" + id + "</td><td>" + name + "</td><td>" + stat + "</td></tr>"
  ).join("\n") +
"</table>";
