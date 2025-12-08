import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
    startChat,
    getMyChats,
    getMessages,
    sendMessage,
} from "../controllers/chatController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/start/:userId", startChat);
router.get("/my", getMyChats);
router.get("/messages/:chatId", getMessages);
router.post("/send", sendMessage);

export default router;