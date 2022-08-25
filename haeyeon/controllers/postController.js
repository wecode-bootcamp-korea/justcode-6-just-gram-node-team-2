const postService = require("../services/postService")

const createPost = async (req, res) => {
  const { user_id, contents } = req.body;

  try {
    await postService.createPost(user_id, contents)
    res.status(201).json({ message: "postCreated" })
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ message: "Error postCreated" })
  }
};

const getPosting = async (req, res) => {

  try {
    const GETpostingData = await postService.getPosting()
    res.status(200).json({ "data": GETpostingData })
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ message: "Error getPost " });
  }
};

const getPostingByUserId = async (req, res) => {
  try {
    const GETpostingData = await postService.getPostingByUserId()
    res.status(200).json({ "data": GETpostingData })
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ message: "Error getPost " });
  }
};

const updatePosting = async (req, res) => {
  const { newContents, id, user_id } = req.body

  try {
    const updatepostingData = await postService.updatePosting(newContents, id, user_id)
    res.status(200).json({ "data": updatepostingData })
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ message: "Error updatePost " });
  }
};

const deletePosting = async (req, res) => {
  try {
    await postService.deletePosting();
    res.status(204).json({ message: "postingDeleted" });
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ message: "Error" });
  }
};

module.exports = { createPost, getPosting, getPostingByUserId, updatePosting, deletePosting }