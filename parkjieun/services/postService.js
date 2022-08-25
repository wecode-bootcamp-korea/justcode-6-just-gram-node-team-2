const postDao = require("../models/postDao");

// posting
const createPost = async (userID, contents, postImg_url) => {
  return await postDao.createPost(userID, contents, postImg_url);
};

// get post-list
const getPost = async () => {
  return await postDao.getPost();
};

// get postList By UserId
const getPostById = async (id) => {
  return await postDao.getPostById(id);
};

// update post
const updatePost = async (id, newContents) => {
  const updatedPostData = postDao.updatePost(id, newContents);
  // const data = postDao.getPostById(id);

  return updatedPostData;
};

// delete post
const deletePost = async (id) => {
  return await postDao.deletePost(id);
};

module.exports = {
  createPost,
  getPost,
  getPostById,
  updatePost,
  deletePost,
};
