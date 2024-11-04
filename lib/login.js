const { verifyLogin } = require("./auth.js");

module.exports = async (req, res) => {
  const user = req.body.username;
  const password = req.body.password;
  if (user.length > 10 || password.length < 8) return;
  return await verifyLogin(user, password, res);
};
