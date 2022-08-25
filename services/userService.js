const userDao = require("../models/userDao");
const bcrypt = require("bcryptjs");
// ----------------------------------------------------------------------------
const createUser = async (nickname, email, password, profile_image) => {
  // 비밀번호 암호화
  const salt = bcrypt.genSaltSync(12);
  const hashedPassword = bcrypt.hashSync(password, salt);

  return await userDao.createUser(
    nickname,
    email,
    hashedPassword,
    profile_image
  );
};
// ------------------------------------------------------------------------------
const login = async (email, password) => {
  const user = await userDao.login(email);

  if (!user) {
    console.log("NO_USER");
    const err = new Error("NO_USER");
    err.status = 404;
    return err;
  }

  // user 있으면 -> 유저 데이터 및 유저 비밀번호 디비에서 꺼내오고,
  const isPasswordCorrect = bcrypt.compareSync(password, user.password); // true or false

  return { isPasswordCorrect, user };
};
module.exports = {
  createUser,
  login,
};
