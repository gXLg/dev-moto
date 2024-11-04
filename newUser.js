const bcrypt = require("bcryptjs");
const { users } = require("./lib/db.js");

(async () => {

  const user = process.argv[2];
  const password = process.argv[3];

  console.log("Creating new user", user);

  const hash = bcrypt.hashSync(password, 10);
  await users[user](u => {
    u.hashed_password = hash;
  });

})();
