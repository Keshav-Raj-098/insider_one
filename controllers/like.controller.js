import { prisma } from "../prisma/prisma.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { ApiError } from "../utils/Apierror.js";




const createLike = async (req, res, next) => {

    const { userId, shortId } = req.params;

    if (!userId || !shortId) {
        return next(new ApiError(400, "Missing userId or shortId"));
    }

    try {
        // Check if a like already exists for this user and short
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_shortId: { // Corrected this part
                    userId,
                    shortId,
                },
            },
        });

        if (existingLike) {
            // If it exists, remove the like (unlike the post)
            await prisma.like.delete({
                where: {
                    id: existingLike.id, // Use the unique ID of the like to delete it
                },
            });

            console.log("Like removed successfully");

            return res.status(200).json(
                new Apiresponse(200, { message: "Like removed successfully" }, "Post unliked")
            );
        } else {
            // If the like doesn't exist, create a new one
            const newLike = await prisma.like.create({
                data: {
                    userId,
                    shortId,
                },
            });
             
            console.log("Like added successfully");
            
            return res.status(200).json(
                new Apiresponse(200, newLike, "Like added successfully")
            );
        }
    } catch (error) {
        console.error("Error while toggling like:", error);
        return next(new ApiError(500, "An error occurred while processing the like action"));
    }
};

export { createLike }