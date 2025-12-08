import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    caption: String,
    mediaUrl: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
        {
            text: String,
            commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            createdAt: { type: Date, default: Date.now }
        }
    ]
});

export default mongoose.model("Post", postSchema);