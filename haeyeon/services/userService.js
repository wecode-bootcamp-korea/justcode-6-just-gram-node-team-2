const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userDao = require("../models/userDao")

const createUser = async (nickname, email, password) => {

  const salt = bcrypt.genSaltSync();
  const hashedPw = bcrypt.hashSync(password, salt)

  return await userDao.createUser(nickname, email, hashedPw)
}

const login = async (email, password) => {

  const user = await userDao.getUserByEmail(email)
  if (!user) {
    const error = new Error("NO USER")
    error.statusCode = 400
    throw error
  }

  const isPasswordCorrect = bcrypt.compareSync(password, user.password)
  if (!isPasswordCorrect) {
    // // method 1
    // throw new Error("INVALID PASSWORD")
    //method 2
    const error = new Error("INVALID PASSWORD")
    error.statusCode = 400
    throw error
  }

  if (user && isPasswordCorrect) {
    const token = jwt.sign({ email: user.email }, 'secretKey') //process.env.secretKey
    return token;
  }
}


module.exports = { createUser, login }