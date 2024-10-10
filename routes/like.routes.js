import express from "express"
import {createLike} from "../controllers/like.controller.js"



const router = express.Router()




router.route("/:shortId/:userId").post(createLike)





export default router


