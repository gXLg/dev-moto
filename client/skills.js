d => "<table><tr><th>ID</th><th>Name</th><th>Profficiency</th></tr>" +
  d.map(
  ({ name, id, prof }) =>
    "<tr><td>" + id + "</td><td>" + name + "</td><td>" + prof + "</td></tr>"
  ).join("\n") +
"</table>";
