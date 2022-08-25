const express = require('express')
const router = express.Router()

const userRouter = require("../routers/userRouter")
const postRouter = require("../routers/postRouter")

router.use('/users', userRouter)
router.use('/postings', postRouter)

module.exports = router