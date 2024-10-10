import { prisma } from "../prisma/prisma.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { ApiError } from "../utils/Apierror.js";

// Create

const createComment = async (req, res, next) => {


    const { shortId,userId } = req.params

    const { content } = req.body;

    console.log(shortId, userId, content);


    if (!userId || !shortId || !content) {
        return next(new ApiError(400, "Missing userId, shortId, or content"));
    }

    try {
        // Check if a comment already exists for this student and short
        const existingComment = await prisma.comment.findFirst({
            where: {
                userId,
                shortId
            }
        });

        if (existingComment) {
            // If it exists, update the comment content
            const updatedComment = await prisma.comment.update({
                where: {
                    id: existingComment.id
                },
                data: {
                    content
                }
            });

            return res.status(200).json(
                new Apiresponse(200, updatedComment, "Comment updated successfully")
            );
        } else {
            // If the comment doesn't exist, create a new one
            const newComment = await prisma.comment.create({
                data: {
                    content,
                    userId,
                    shortId
                }
            });

            return res.status(200).json(
                new Apiresponse(200, newComment, "Comment added successfully")
            );
        }
    } catch (error) {
        console.error("Error while adding/updating comment:", error);
        return next(new ApiError(500, "An error occurred while processing the comment action"));
    }
}


// Delete

const deleteComment = async (req, res, next) => {
    const { commentId } = req.params; // The comment ID is passed through req.params

    if (!commentId) {
        return next(new ApiError(400, "Missing comment ID"));
    }

    try {
        // Check if the comment exists
        const existingComment = await prisma.comment.findUnique({
            where: {
                id: commentId,
            },
        });

        if (!existingComment) {
            return next(new ApiError(404, "Comment not found"));
        }

        // Delete the comment
        await prisma.comment.delete({
            where: {
                id: commentId, // Use the comment ID to delete it
            },
        });

        return res.status(200).json(
            new Apiresponse(200, { message: "Comment deleted successfully" }, "Comment deleted")
        );
    } catch (error) {
        console.error("Error while deleting comment:", error);
        return next(new ApiError(500, "An error occurred while deleting the comment"));
    }
};



export { createComment, deleteComment }

