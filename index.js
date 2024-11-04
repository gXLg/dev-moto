const nulls = require("nulls");

const { checkToken } = require("./lib/auth.js");

nulls({
  "init": (app, server) => {
    process.on("SIGINT", () => server.close());
  },
  "hook": async (req, res) => {
    const token = req.cookies.token;
    if (token == null) req.auth = null;
    else req.auth = await checkToken(token);
  },
  "nulls": "./html",
  "static": "./static",
  "ready": () => console.log("Server up!"),
  "port": parseInt(process.argv[2] ?? 31337),
  "https": false
});


/*

## Basic Skills
* Discipline
* Concentration
* Learning
* Productivity
* ...

## Targeted Skills
Skills based on things I learn in the university, my hobbies or job.

## Status
* Sleep
* Motivation
* Happiness
* Freshness
* ...


*/

