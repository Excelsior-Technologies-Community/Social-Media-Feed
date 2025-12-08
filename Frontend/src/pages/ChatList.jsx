import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

function ChatList() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/auth/all-users").then((res) => {
            setUsers(res.data.users);
        });
    }, []);

    const openChat = async (otherUserId) => {
        const res = await api.post(`/chat/start/${otherUserId}`);
        const chatId = res.data.chatId;
        navigate(`/chat/${chatId}`);
    };

    return (
        <div className="min-h-screen bg-gray-100">

            <div className="sticky top-0 z-50 bg-white shadow-sm border-b px-4 py-3">
                <h2 className="text-xl font-bold text-gray-900">Messages</h2>
            </div>

            <div className="p-4 space-y-4 max-w-xl mx-auto">

                {users.length === 0 && (
                    <p className="text-gray-500 text-center">No users found.</p>
                )}

                {users.map((u) => (
                    <div
                        key={u._id}
                        onClick={() => openChat(u._id)}
                        className="flex items-center gap-3 bg-white p-3 rounded-xl shadow hover:shadow-md transition cursor-pointer"
                    >
                        <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                            {u.name?.charAt(0).toUpperCase()}
                        </div>

                        <div className="flex-1">
                            <p className="text-gray-900 font-semibold">{u.name}</p>
                            <p className="text-gray-500 text-sm">Tap to chat</p>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}

export default ChatList;
