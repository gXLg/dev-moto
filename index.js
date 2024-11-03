const nulls = require("nulls");

nulls({
  "init": (app, server) => {
    process.on("SIGINT", () => server.close());
  },
  "hook": async (req, res) => {
  },
  "nulls": "./html",
  "static": "./static",
  "ready": () => console.log("Server up!"),
  "port": 31337,
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

