import { prisma } from "../prisma/prisma.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { ApiError } from "../utils/Apierror.js";





// creating shorts by students


const createShort = async (req, res, next) => {


    try {

        const { userId } = req.params

        const reelCreated = await prisma.short.create({
            data: {
                videoUrl: req.Posturl || null, // Use null if not available
                title: req.body.title,
                description: req.body.description,
                student: {
                    connect: {
                        id: userId
                    }
                }

            }
        });

        if (!reelCreated) {
            throw new ApiError(500, "Something went wrong while creating the post");
        }

        return res.status(200).json(
            new Apiresponse(200, reelCreated, "Post Created Successfully")
        );

    } catch (error) {
        console.error(error); // Log the error for debugging
        throw ApiError(501, "Can't process your request right now");
        // Use next to pass the error to error handling middleware
    }
};


const getAllPost = async (req, res, next) => {
    try {
        const posts = await prisma.short.findMany({
            orderBy: {
                createdAt: 'desc', 
            },
            include: {
                comments: {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        updatedAt: true,
                        student: { // Fetch the student details for the comment
                            select: {
                                id: true,
                                name: true, // Include the name from the user model
                            },
                        },
                    },
                },
                likes: {
                    select: {
                        id: true,
                        createdAt: true,
                        student: {
                            select: {
                                id: true,
                            },
                        },
                    },
                },
                student: { // Fetch the name of the person who created the post (user relation)
                    select: {
                      name: true, // Include only the name from the user model
                    },
                  },
            },
        });

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: "No posts found" });
        }

        const postsWithCounts = posts.map(post => ({
            ...post,
            commentsCount: post.comments.length,
            likesCount: post.likes.length,
        }));

        res.status(200).json(new Apiresponse(200, postsWithCounts, "Posts Found Successfully"));
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch posts", error: error.message });
    }
};





const deleteShort = async (req, res, next) => {
    const { shortId } = req.params; // The short/post ID is passed through req.params

    if (!shortId) {
        return next(new ApiError(400, "Missing post ID"));
    }

    try {
        // Check if the short exists
        const existingShort = await prisma.short.findUnique({
            where: {
                id: shortId,
            },
        });

        if (!existingShort) {
            return next(new ApiError(404, "Post not found"));
        }

        // Delete related likes
        await prisma.like.deleteMany({
            where: {
                shortId: shortId, // Delete all likes associated with this post
            },
        });

        // Delete related comments
        await prisma.comment.deleteMany({
            where: {
                shortId: shortId, // Delete all comments associated with this post
            },
        });

        // Delete the short itself
        await prisma.short.delete({
            where: {
                id: shortId, // Delete the post
            },
        });

        return res.status(200).json(
            new Apiresponse(200, { message: "Post and related data deleted successfully" }, "Post deleted")
        );
    } catch (error) {
        console.error("Error while deleting post and related data:", error);
        return next(new ApiError(500, "An error occurred while deleting the post and related data"));
    }
};












export { createShort, getAllPost, deleteShort }
