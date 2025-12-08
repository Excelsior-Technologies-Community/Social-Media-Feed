import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import { createPost,getAllPosts ,likePost ,addComment  } from "../controllers/postController.js";

const router = express.Router();

router.post("/create", authMiddleware, upload.single("media"), createPost);
router.get("/all", authMiddleware, getAllPosts);
router.put("/like/:postId", authMiddleware, likePost);
router.post("/comment/:postId", authMiddleware, addComment);

export default router;
