import Post from "../models/Post.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const createPost = async (req, res) => {
    try {
        let mediaUrl = null;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "posts",
            });

            mediaUrl = result.secure_url;
            fs.unlinkSync(req.file.path);
        }

        const newPost = await Post.create({
            caption: req.body.caption || "",
            mediaUrl: mediaUrl,
            createdBy: req.user.id,
        });

        return res.json({
            success: true,
            message: "Post created",
            post: newPost,
        });

    } catch (error) {
        console.error("POST CREATE ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};




export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("createdBy", "name email")
            .populate("comments.commentedBy", "name email")
            .sort({ createdAt: -1 });

        res.json({
            message: "All posts fetched",
            total: posts.length,
            posts
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const likePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const isLiked = post.likes.includes(userId);

        if (isLiked) {
            post.likes = post.likes.filter(id => id.toString() !== userId.toString());
        } else {
            post.likes.push(userId);
        }

        await post.save();

        res.json({
            message: isLiked ? "Post unliked" : "Post liked",
            likesCount: post.likes.length,
            likes: post.likes
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




export const addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { text } = req.body;
        const userId = req.user._id;

        if (!text) {
            return res.status(400).json({ message: "Comment text is required" });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        post.comments.push({
            text,
            commentedBy: userId,
            createdAt: new Date()
        });

        await post.save();

        res.json({
            message: "Comment added",
            comments: post.comments
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
