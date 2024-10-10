import express from "express"
import {createComment,deleteComment} from "../controllers/comment.controller.js"



const router = express.Router()




router.route("/create/:shortId/:userId").post(createComment)
router.route("/delete/:commentId").delete(deleteComment)





export default router


