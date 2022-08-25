const postDao = require('../models/postDao')

const createPost = async (user_id, contents) => {
  return await postDao.createPost(user_id, contents)
}

const getPosting = async () => {
  return await postDao.getPosting();
}

const getPostingByUserId = async (req, res) => {
  return await postDao.getPostingByUserId();
}

const updatePosting = async (newContents, id, user_id) => {
  return await postDao.updatePosting(newContents, id, user_id)
}

const deletePosting = async (req, res) => {
  return await postDao.deletePosting();
}

module.exports = { createPost, getPosting, getPostingByUserId, updatePosting, deletePosting }