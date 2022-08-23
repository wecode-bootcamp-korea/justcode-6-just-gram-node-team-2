const userService = require("../services/userService");

const createUser = async (req, res) => {
  const { email, nickname, password, profile_image } = req.body;

  const hasKey = { email: false, password: false, nickname: false };
  const requireKey = Object.keys(hasKey);
  try {
    const user = await userService.createUser(
      email,
      nickname,
      password,
      profile_image
    );
    res.status(201).json({ message: "userCreated" });
  } catch(err) {
    console.log(err)
    res.status(500).json({ message: "Signup Error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await userService.loginUser(email, password);
    res.status(200).json({ message: "LOGIN_SUCCESS", token});
  } catch(err) {
    console.log(err)
    res.status(err.statusCode || 500).json(err.message);
  }
};

module.exports = { createUser, loginUser };
