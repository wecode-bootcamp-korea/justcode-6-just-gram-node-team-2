const postingDao = require("../models/postingDao.js");
const bcrypt = require("bcryptjs");
// ------------------------------------------------------------------------------
const createPosting = async (user_id, contents, image_url) => {
  // user_id가 입력 됐는지 확인
  if (!user_id) {
    const postsUserIdError = new Error("user_id is not entered");
    postsUserIdError.status = 400;
    throw postsUserIdError;
  }

  await postingDao.createPosting(user_id, contents, image_url);
};
// -------------------------------------------------------------------------------
const searchPostings = async () => {
  const everyPosting = await postingDao.searchPostings();
  return everyPosting;
};
// -------------------------------------------------------------------------------
const modifyPosting = async (userId, postingId, content) => {
  if (!(userId && postingId)) {
    const idError = new Error("userId/postingId is not entered");
    idError.status = 404;
    throw idError;
  }
  const modify = await postingDao.modifyPosting(userId, postingId, content);
  return modify;
};
// ------------------------------------------------------------------------------
const deletePosting = async (userId, postingId) => {
  await postingDao.deletePosting(userId, postingId);
};
// ------------------------------------------------------------------------------
const searchPostingsByUser = async (userId) => {
  const postingsByUser = await postingDao.searchPostingsByUser(userId);
  return postingsByUser;
};
module.exports = {
  createPosting,
  searchPostings,
  modifyPosting,
  deletePosting,
  searchPostingsByUser,
};
