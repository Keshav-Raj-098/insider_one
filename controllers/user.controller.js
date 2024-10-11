import { prisma } from "../prisma/prisma.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { ApiError } from "../utils/Apierror.js";

const UserRegister = async (req, res) => {

    try {
      

        const user = await prisma.user.create(
            {
                data: {
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password

                }
            }
        )


        if (!user) {
            console.error(400, "Server Busy can't register You")
        }

        return res.json(new Apiresponse(200, user.id, "Registered Successfully"));

    } catch (error) {
        throw new ApiError(402, "Error in field");

    }
}



const UserLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // If user not found, return an error
        if (!user) {
            return res.status(404).json(new Apiresponse(404, null, "User not found"));
        }

        // Check if the provided password matches the stored password
        if (user.password !== password) {
            return res.status(401).json(new Apiresponse(401, null, "Invalid credentials"));
        }

        // Return only the userId on successful login
        return res.json(new Apiresponse(200, user.id, "Login successful"));
    } catch (error) {
        return res.status(500).json(new Apiresponse(500, null, "Internal server error"));
    }
};




export { UserRegister,UserLogin }