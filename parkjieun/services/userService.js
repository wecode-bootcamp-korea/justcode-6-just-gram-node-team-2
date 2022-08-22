const userDao = require("../models/userDao");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// signUp
const createUser = async (nickname, email, password, profile_image) => {
  // 비밀번호 암호화
  const salt = bcrypt.genSaltSync(13);
  const hashedPw = bcrypt.hashSync(password, salt);

  const result = await userDao.createUser(
    nickname,
    email,
    hashedPw,
    profile_image
  );
  return result;
};

// logIn
const logInUser = async (email, password) => {
  try {
    const [queryRes] = await userDao.logInUser(email);
    const comparePw = bcrypt.compareSync(password, queryRes.password);
    //DB에서 hashedPw 가져와서 비교

    if (comparePw) {
      //JWT 발행
      const token = jwt.sign({ user_id: queryRes.id }, "secretKey", {
        expiresIn: "1h",
      });
      return token;
    } else if (!comparePw) {
      // 비밀번호 불일치로 토큰 발행 실패
      return 1;
    }
  } catch {
    // email이 존재하지 않아 쿼리문 실행 실패
    return 0;
  }
};

module.exports = {
  createUser,
  logInUser,
};
