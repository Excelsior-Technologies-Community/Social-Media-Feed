import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../context/AuthProvider";

function Signup() {
    const { setUser } = useContext(AuthContext);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const res = await api.post("/auth/register", form);

            const { token, user } = res.data;

            localStorage.setItem("token", token);

            localStorage.setItem("user", JSON.stringify(user));

            setUser(user);

            setMessage("Signup successful. Redirecting...");

            setTimeout(() => {
                navigate("/");

            }, 1500);
        } catch (error) {
            setMessage("Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">

                <h2 className="text-2xl font-semibold mb-6 text-center">Signup</h2>

                <form className="space-y-4" onSubmit={handleSubmit}>

                    <input
                        type="text"
                        placeholder="Name"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-600 focus:ring outline-none"
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-600 focus:ring outline-none"
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-600 focus:ring outline-none"
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                    />

                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
                        Signup
                    </button>
                </form>

                {message && (
                    <p className="text-center mt-4 text-green-600 font-medium">
                        {message}
                    </p>
                )}

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-blue-600 font-medium hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
}

export default Signup;
