const userService = require("../services/userService.js");
const jwt = require("jsonwebtoken");

// ----------------------------------------------------------------
const createUser = async (req, res) => {
  const { nickname, email, password, profile_image } = req.body.data;

  // Error Handling

  // 간단한 버전
  if (!(nickname && email && password)) {
    const signupError = new Error("Input Error");
    signupError.status = 400;
    throw signupError;
  }
  try {
    await userService.createUser(nickname, email, password, profile_image);
    res.status(201).json({ message: "userCreated" });
  } catch (err) {
    console.log(err);
    res.status(err.statusCode || 500).json(err.message);
  }
};
// ------------------------------------------------------------------
const login = async (req, res) => {
  // PART 1 : request body
  const { email, password } = req.body.data;

  const { isPasswordCorrect, user } = await userService.login(email, password);

  // isPasswordCorrect === object
  if (typeof isPasswordCorrect == Object) {
    res.status(404).json({ message: "INVALID_PASSWORD" });
  } else {
    // token 생성
    const token = jwt.sign({ userId: user.id }, "secretKey");

    // send token to frontend
    res.status(200).json({ message: "LOGIN_SUCCESS", token: token });
  }
};

module.exports = {
  createUser,
  login,
};
