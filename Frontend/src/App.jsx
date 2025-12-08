import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import ProtectedRoute from "./Component/ProtectedRoute";
import CreatePost from "./pages/CreatePost";
import ChatList from "./pages/ChatList";
import ChatWindow from "./pages/ChatWindow";

function App() {

  const token = localStorage.getItem("token");

  return (
    <>
      <Routes>

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            token ? <Navigate to="/feed" replace /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          }
        />

        <Route path="/chats" element={<ChatList />} />


        <Route
          path="/add_post"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat/:chatId"
          element={
            <ProtectedRoute>
              <ChatWindow />
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  );
}

export default App;
