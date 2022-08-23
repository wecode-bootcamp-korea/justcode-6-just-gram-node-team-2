const userDao = require("../models/userDao");
//서비스는 오로지 dao에 의존
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { json } = require("express");

const createUser = async (email, nickname, password, profile_image) => {
  const salt = bcrypt.genSaltSync(12);
  const hashedPw = bcrypt.hashSync(password, salt);
  return await userDao.createUser(email, nickname, hashedPw, profile_image);
};

const loginUser = async (email, password) => {
  const user = await userDao.findUserByEmail(email);
  const isPasswordCorrect = bcrypt.compareSync(password, user.password);

  // 맞으면 true, 틀리면 false
  if (!isPasswordCorrect) {
    // error throw
    // method 1 - directly
    throw new Error("INVALID PASSWORD")

    // method 2 - variable
    const error = new Error("INVALID PASSWORD")
    error.statusCode = 400
    throw error
  }

  if (user && isPasswordCorrect) {
    const token = jwt.sign({ userId: user.id }, process.env.secretKey);
    return token;
  }
};

module.exports = { createUser, loginUser };
