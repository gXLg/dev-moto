const { BadTable } = require("badb");

const users = new BadTable("./data/users.badb", {
  "key": "user",
  "values": [
    { "name": "user", "maxLength": 10 },
    { "name": "hashed_password", "maxLength": 60 }
  ]
});

module.exports = { users };
