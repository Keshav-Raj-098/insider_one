import express from "express"
import { upload } from "../middleware/multer.middelware.js"
import { uploadShortMiddleware,uploadImage } from "../middleware/profileImage.middleware.js";
import {createShort, deleteShort, getAllPost} from "../controllers/post.contoller.js"



const router = express.Router()


router.route("/create/:userId").post( upload.single("post"), uploadShortMiddleware("Post"),createShort)

router.route("/getAll").get(getAllPost)
router.route("/delete/:shortId").delete(deleteShort)














export default router
