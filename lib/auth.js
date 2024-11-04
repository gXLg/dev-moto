const bcrypt = require("bcryptjs");
const { users } = require("./db.js");

const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config.json");

const LOGIN_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

function setCookie(res, user) {
  const token = jwt.sign({ user }, jwt_secret, {
    "expiresIn": LOGIN_DURATION.toString()
  });
  const options = {
    "httpOnly": true,
    "sameSite": true,
    "maxAge": LOGIN_DURATION
  };
  res.cookie("token", token, options);
}

async function checkToken(token) {
  let d;
  try {
    d = jwt.verify(token, jwt_secret);
  } catch {
    return null;
  }
  const { user } = d;
  if (await users[user]((_, c) => !c.exists())) return null;
  return user;
}

async function verifyLogin(user, password, res) {
  const { hashed_password } = await users[user](u => u);
  if (!hashed_password) return false;
  if (!bcrypt.compareSync(password, hashed_password)) return false;
  setCookie(res, user);
  return true;
}

module.exports = { verifyLogin, checkToken };
