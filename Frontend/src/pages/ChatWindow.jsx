import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

function ChatWindow() {
    const { chatId } = useParams();
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [chatUser, setChatUser] = useState(null);

    const myId = localStorage.getItem("userId");

    const loadMessages = async () => {
        const res = await api.get(`/chat/messages/${chatId}`);
        setMessages(res.data.messages);

        if (res.data.messages.length > 0) {
            const last = res.data.messages[0];
            const user =
                last.sender._id === myId ? last.chatUser : last.sender;
            setChatUser(user);
        }
    };

    useEffect(() => {
        loadMessages();
    }, [chatId]);

    const sendMessage = async () => {
        if (!text.trim()) return;

        await api.post(`/chat/send`, { chatId, text });

        setText("");
        loadMessages();
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">

            <div className="bg-white shadow px-4 py-3 flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="text-xl text-gray-600 hover:text-black"
                >
                    ←
                </button>

                <h2 className="text-lg font-semibold text-gray-800">
                    Chat
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {messages.map((m) => {
                    const isMe = m.sender._id === myId;

                    return (
                        <div
                            key={m._id}
                            className={`flex flex-col ${isMe ? "items-end" : "items-start"
                                }`}
                        >
                            <p className="text-xs text-gray-500 mb-1">
                                {isMe ? "You" : m.sender.name}
                            </p>

                            <div
                                className={`px-4 py-2 rounded-2xl max-w-[70%] shadow 
                                ${isMe
                                        ? "bg-blue-600 text-white rounded-br-none"
                                        : "bg-white text-gray-800 rounded-bl-none border"
                                    }
                                `}
                            >
                                {m.text}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="p-3 bg-white border-t flex items-center gap-2">
                <input
                    className="flex-1 p-3 border rounded-full bg-gray-100 outline-none focus:ring-2 focus:ring-blue-400"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                />

                <button
                    onClick={sendMessage}
                    className="px-5 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition"
                >
                    Send
                </button>
            </div>

        </div>
    );
}

export default ChatWindow;
