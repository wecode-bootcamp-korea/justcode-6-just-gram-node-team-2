const userService = require("../services/userService");

// signUp
const createUser = async (req, res) => {
  const { nickname, email, password, profile_image } = req.body;

  // 유효성 검사 >> 더 세분화하기
  if (!(nickname && email && password)) {
    res.status(400).json({ message: "input error" });
    return;
  }

  try {
    const result = await userService.createUser(
      nickname,
      email,
      password,
      profile_image
    );
    res.status(201).json({ message: "userCreated" });
  } catch {
    res.status(500).json({ message: "user create Error" });
  }
};

// logIn
const logInUser = async (req, res) => {
  const { email, password } = req.body;

  // email, password 유효성 검증
  if (!(email && password)) {
    res.status(400).json({ message: "email과 password를 확인해 주세요." });
  }

  try {
    const result = await userService.logInUser(email, password);

    if (result == 0) {
      // users 테이블에 email이 없음
      res.status(400).json({ message: "회원이 아닙니다." });
    } else if (result == 1) {
      // email이 있으나 password가 틀림
      res.status(400).json({ message: "비밀번호를 확인해 주세요." });
    } else {
      // 정상적으로 login
      res.status(201).json({ Token: result });
    }
  } catch {
    // console.log(err);
    res.status(400).json({ message: "email을 확인해주세요." });
  }
};

module.exports = {
  createUser,
  logInUser,
};
