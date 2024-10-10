import express from "express"
import { UserRegister,UserLogin } from "../controllers/user.controller.js"






const router = express.Router()



router.route("/register").post(UserRegister)
router.route("/login").post(UserLogin)





export default router