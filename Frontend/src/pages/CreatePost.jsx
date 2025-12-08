import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!media) return;

    setLoading(true);

    const fd = new FormData();
    fd.append("caption", caption);
    fd.append("media", media);

    await api.post("/post/create", fd);

    setLoading(false);

    setSuccessMessage("Post created successfully!");

    setCaption("");
    setMedia(null);
    setPreview(null);

    setTimeout(() => {
      setSuccessMessage("");
      navigate("/feed");
    }, 1500);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setMedia(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-10">
      <div className="bg-white max-w-lg w-full rounded-xl shadow-md p-6">

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Create New Post
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          <textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows="3"
          />

          <div>
            <label className="block w-full p-3 border border-gray-300 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 text-center">
              <span className="text-gray-600">Choose Image</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>

          {preview && (
            <div className="w-full rounded-lg overflow-hidden shadow">
              <img src={preview} alt="preview" className="w-full object-cover max-h-[350px]" />
            </div>
          )}

          <button
            disabled={!media || loading}
            className={`w-full py-3 text-white rounded-lg transition
              ${!media || loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
            `}
          >
            {loading ? "Posting..." : "Post"}
          </button>

          {successMessage && (
            <p className="text-green-600 text-center font-medium mt-3">
              {successMessage}
            </p>
          )}

        </form>
      </div>
    </div>
  );
}

export default CreatePost;
