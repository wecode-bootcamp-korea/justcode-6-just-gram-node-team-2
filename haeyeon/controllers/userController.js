
const userService = require('../services/userService')

const createUser = async (req, res) => {

  const { nickname, email, password } = req.body;
  const hasKey = { nickname: false, email: false, password: false };
  const requireKey = Object.keys(hasKey);

  Object.entries(req.body).forEach((keyValue) => {
    const [key, value] = keyValue;
    if (requireKey.includes(key) && value) {
      hasKey[key] = true;
    }
  });

  const hasKeyArray = Object.entries(hasKey);
  for (let i = 0; i < hasKeyArray.length; i++) {
    const [key, value] = hasKeyArray[i];
    if (!value) {
      res.status(400).json({ message: `${key}이/가 없습니다.` });
      return;
    }
  }
  try {
    await userService.createUser(nickname, email, password)
    res.status(201).json({ message: "userCreated" })
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ message: "Error userCreated " });
  }
}

const login = async (req, res) => {

  const { email, password } = req.body;

  try {
    await userService.login(email, password)

    const token = await userService.login.token
    res.status(200).json({ message: 'LOGIN_SUCCESS', token })
  }
  catch (err) {
    console.log(err)
    res.status(err.statusCode || 500).json(err.message)
  }
}

module.exports = { createUser, login }