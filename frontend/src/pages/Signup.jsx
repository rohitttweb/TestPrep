import React, { useState } from "react";
import { House } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL

const SignUp = () => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [repassword, setRepassword] = useState("");
    const [role, setRole] = useState("user"); // Default role is "user"
    const [errorMessage, setErrorMessage] = useState("");

    const handleUsernameChange = (value) => {
        setUsername(value);
        setErrorMessage("");
        fetch(`${API_BASE_URL}/api/Auth/isexist`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ __username: value }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (!data.success) {
                    setErrorMessage(data.message);
                }
            })
            .catch((error) => console.error("Error:", error));
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        if (!name || !username || !password || !repassword) {
            setErrorMessage("Please fill out all fields.");
            return;
        }

        if (password !== repassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        const userData = { name, username, password, role }; // Include role in request
        fetch(`${API_BASE_URL}/api/Auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    window.location.href = "/login";
                } else {
                    setErrorMessage("Registration failed. Please try again.");
                }
            })
            .catch((error) => console.error("Error:", error));
    };

    return (
        <div className="flex justify-center items-center h-[calc(100vh-100px)] bg-white">
            <div className="fixed top-5 left-5 z-50">
                <a href="/"><House /></a>
            </div>
            <div className="w-96 p-6 bg-white rounded-lg ">
                <div className="text-center mb-4">
                    <a href="/">
                        <img src="logo.png" alt="Logo" className="w-20 mx-auto" />
                    </a>
                </div>
                <form className="form-control" onSubmit={handleSignUp}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input input-bordered w-full mb-4"
                    />
                    <label className="input mb-4 input-bordered flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => handleUsernameChange(e.target.value)}
                            className={`grow  ${errorMessage ? "border-red-500" : ""}`}
                        />
                    </label>

                    

                    <label className="input mb-4 input-bordered flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                            <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                        </svg>
                        <input
                            type="password"
                            placeholder="Password"
                            className="grow"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                    <label className="input mb-4 input-bordered flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                            <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                        </svg>
                        <input
                            type="password"
                            placeholder="Re-enter Password"
                            className="grow"
                            value={repassword}
                            onChange={(e) => setRepassword(e.target.value)}
                        />
                    </label>
                    {/* Role Selection */}
                    <div className="mb-4">
                        <label className="text-gray-600">Sign up as:</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="user">User</option>
                            <option value="org">Organization</option>
                        </select>
                    </div>

                    {errorMessage && <div className="text-red-500 mb-3">{errorMessage}</div>}
                    <button type="submit" className="btn btn-primary w-full">
                        Sign Up
                    </button>
                    <p className="text-center text-sm text-gray-600 mt-4">
                        Already have an account?{" "}
                        <a href="/login" className="text-primary hover:underline">
                            Login
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
