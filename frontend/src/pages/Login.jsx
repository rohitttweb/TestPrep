import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import useAuth
import { House, Eye, EyeOff } from "lucide-react";
const API_BASE_URL = import.meta.env.VITE_API_URL

const Login = () => {
    const { setUser, user, loading } = useAuth(); // Make sure useAuth() provides setUser
    const [username, setUsername] = useState("");
    const [userlogin, setuserlogin] = useState(false);
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        if (!loading && user) {
            const redirectPath = localStorage.getItem("redirectAfterLogin") || "/dashboard";
            localStorage.removeItem("redirectAfterLogin");
            navigate(redirectPath);
        }
    }, [user, loading, navigate]);

    if (loading) return <div>Loading...</div>;

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!username || !password) {
            setErrorMessage("Both fields are required.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/Auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();

            if (result.success) {
                document.cookie = `UserToken=${result.token}; expires=${new Date(
                    Date.now() + 86400000 * 7
                ).toUTCString()}; path=/`;

                setUser(result.user);
                setuserlogin(true)

                const redirectPath = localStorage.getItem("redirectAfterLogin") || "/dashboard";
                localStorage.removeItem("redirectAfterLogin");
                window.location.href = redirectPath;
            } else {
                setErrorMessage(result.message || "Invalid credentials.");
            }
        } catch (error) {
            console.error("Login Error:", error);
            setErrorMessage("Failed to connect to the server.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-white-100">
            <div className="absolute top-5 left-5">
                <a href="/" className="text-gray-600 hover:text-black">
                    <House />
                </a>
            </div>

            <div className=" w-96 p-6 bg-white rounded-lg">
                <div className="text-center mb-6">
                    <a href="/">
                        <img src="logo.png" alt="Logo" className="w-20 mx-auto" />
                    </a>
                </div>

                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="border-2 border-gray-700 rounded-lg w-full px-4 py-2 mb-4 border rounded-md focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border-2 border-gray-700 rounded-lg  w-full px-4 py-2 mb-4 border rounded-md focus:ring-2 focus:ring-blue-500 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-800"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {errorMessage && (
                        <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Login
                    </button>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        Don't have an account?{" "}
                        <a href="/signup" className="text-blue-600 hover:underline">
                            Sign Up
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
