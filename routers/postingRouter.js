const express = require("express");
const postingController = require("../controllers/postingController");

const router = express.Router();

router.post("", postingController.createPosting);
router.get("", postingController.searchPostings);
router.get("/user", postingController.searchPostingsByUser);
router.patch("/", postingController.modifyPosting);
router.delete("/", postingController.deletePosting);

module.exports = router;
