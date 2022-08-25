const postingService = require("../services/postingService.js");

const createPosting = async (req, res) => {
  const { user_id, contents, image_url } = req.body.data;
  try {
    await postingService.createPosting(user_id, contents, image_url);
    res.status(201).json({ message: "CreatePosting" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "ERROR" });
  }
};
// --------------------------------------------------------------------
const searchPostings = async (req, res) => {
  try {
    const everyPost = await postingService.searchPostings();
    res.status(200).json({ data: everyPost });
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
};
// --------------------------------------------------------------------
const modifyPosting = async (req, res) => {
  const { userId, postingId, content } = req.body.data;

  try {
    const newPosting = await postingService.modifyPosting(
      userId,
      postingId,
      content
    );
    res.status(200).json({ data: newPosting[0] });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error" });
  }
};
// --------------------------------------------------------------------
const deletePosting = async (req, res) => {
  const { userId, postingId } = req.body.data;

  try {
    await postingService.deletePosting(userId, postingId);
    res.status(204).json({ message: "postingDeleted" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "error" });
  }
};
// ------------------------------------------------------------------
const searchPostingsByUser = async (req, res) => {
  const { userId } = req.body.data;
  try {
    const postingsByUser = await postingService.searchPostingsByUser(userId);
    res.status(200).json({ data: postingsByUser });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "error" });
  }
};

module.exports = {
  createPosting,
  searchPostings,
  modifyPosting,
  deletePosting,
  searchPostingsByUser,
};
