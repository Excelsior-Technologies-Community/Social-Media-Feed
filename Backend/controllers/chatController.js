import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

export const startChat = async (req, res) => {
  try {
    const user1 = req.user._id;
    const user2 = req.params.userId;

    if (user1.toString() === user2.toString()) {
      return res.status(400).json({ message: "You cannot chat with yourself" });
    }

    let chat = await Chat.findOne({
      users: { $all: [user1, user2] },
    }).populate("users", "name email");

    if (!chat) {
      chat = await Chat.create({
        users: [user1, user2],
      });

      chat = await chat.populate("users", "name email");
    }

    res.json({ message: "Chat ready", chatId: chat._id, chat });
  } catch (error) {
    console.error("Start chat error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      users: req.user._id,
    })
      .populate("users", "name email")
      .sort({ updatedAt: -1 });

    res.json({ message: "Chats fetched", chats });
  } catch (error) {
    console.error("My chats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);

    if (!chat || !chat.users.includes(req.user._id)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.json({ message: "Messages fetched", messages });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { chatId, text } = req.body;

    if (!chatId || !text?.trim()) {
      return res.status(400).json({ message: "chatId and text are required" });
    }

    const chat = await Chat.findById(chatId);

    if (!chat || !chat.users.includes(req.user._id)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const message = await Message.create({
      chat: chatId,
      sender: req.user._id,
      text: text.trim(),
    });

    chat.lastMessage = text.trim();
    await chat.save();

    const populatedMsg = await message.populate("sender", "name email");

    res.status(201).json({
      message: "Message sent",
      data: populatedMsg,
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
