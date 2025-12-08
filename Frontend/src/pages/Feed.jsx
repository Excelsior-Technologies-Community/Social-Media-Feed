import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [showHeart, setShowHeart] = useState({});
  const [commentText, setCommentText] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/post/all").then((res) => {
      setPosts(res.data.posts);
    });
  }, []);

  const handleLike = async (id) => {
    await api.put(`/post/like/${id}`);
    const updated = await api.get("/post/all");
    setPosts(updated.data.posts);
  };

  const handleDoubleTap = async (id) => {
    await handleLike(id);
    setShowHeart((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setShowHeart((prev) => ({ ...prev, [id]: false }));
    }, 700);
  };

  const handleComment = async (postId) => {
    if (!commentText[postId]?.trim()) return;

    await api.post(`/post/comment/${postId}`, {
      text: commentText[postId],
    });

    const updated = await api.get("/post/all");
    setPosts(updated.data.posts);

    setCommentText((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">

          <h1 className="text-xl font-semibold text-gray-900 tracking-wide">
            Social_Media
          </h1>

          <button
            onClick={() => navigate("/add_post")}
            className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition" >
            Add Post
          </button>

          <button
            onClick={() => navigate("/chats")}
            className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition"
          >
            Messages
          </button>

        </div>
      </div>

      <div className="py-8 px-4">
        <div className="max-w-xl mx-auto space-y-6">

          {posts.map((p) => (
            <div key={p._id} className="bg-white rounded-xl shadow-md border">

              <div className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold">
                  {p.createdBy?.name?.charAt(0).toUpperCase()}
                </div>

                <p className="text-gray-800 font-semibold">
                  {p.createdBy?.name}
                </p>
              </div>

              <div
                className="relative w-full"
                onDoubleClick={() => handleDoubleTap(p._id)}
              >
                <img
                  src={p.mediaUrl}
                  className="w-full max-h-[450px] object-cover"
                />

                {showHeart[p._id] && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-24 h-24 text-red-600 opacity-80 animate-ping"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 
                      12.28 2 8.5 2 
                      5.42 4.42 3 7.5 3c1.74 0 3.41.81 
                      4.5 2.09C13.09 3.81 14.76 3 16.5 
                      3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 
                      6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                )}
              </div>

              {p.caption && (
                <div className="px-4 pb-2">
                  <h3 className="text-lg mt-2 text-gray-800">
                    {p.caption}
                  </h3>
                </div>
              )}

              <div className="p-4 flex items-center justify-between">
                <p className="text-gray-700 font-medium">
                  Likes: {p.likes.length}
                </p>

                <button
                  onClick={() => handleLike(p._id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Like / Unlike
                </button>
              </div>

              <div className="px-4 mb-3">

                {p.comments.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {p.comments.map((c) => (
                      <div
                        key={c._id}
                        className="bg-gray-100 p-2 rounded-lg"
                      >
                        <p className="text-sm">
                          <span className="font-semibold">
                            {c.commentedBy?.name}:
                          </span>{" "}
                          {c.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText[p._id] || ""}
                    onChange={(e) =>
                      setCommentText((prev) => ({
                        ...prev,
                        [p._id]: e.target.value,
                      }))
                    }
                    className="flex-1 p-2 border rounded-lg outline-none"
                  />

                  <button
                    onClick={() => handleComment(p._id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Post
                  </button>
                </div>

              </div>

            </div>
          ))}

        </div>
      </div>

    </div>
  );
}

export default Feed;
