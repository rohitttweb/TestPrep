import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL // Load from .env

const UserProfile = () => {
    const [user, setUser] = useState({});
    const [testsOverview, setTestsOverview] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getUserToken = () => {
        const cookies = document.cookie.split("; ");
        for (let i = 0; i < cookies.length; i++) {
            const [name, value] = cookies[i].split("=");
            if (name === "UserToken") return value;
        }
        return null;
    };

    const Token = getUserToken();

    useEffect(() => {
        if (!Token) return;

        const fetchUser = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/user/profile`, {
                    headers: { Authorization: `Bearer ${Token}` },
                });
                setUser(response.data.user);
            } catch (error) {
                setError(error.response?.data?.message || "Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        const fetchTestOverview = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/usertests/overview`, {
                    headers: { Authorization: `Bearer ${Token}` },
                });
                setTestsOverview(response.data);
            } catch (error) {
                console.error("Failed to load test overview:", error);
            }
        };

        fetchUser();
        fetchTestOverview();
    }, [Token]);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const saveProfile = async () => {
        try {
            const response = await axios.put(`${API_BASE_URL}/api/user/profile`, user, {
                headers: { Authorization: `Bearer ${Token}` },
            });
            setUser(response.data.user);
            setIsEditing(false);
        } catch (error) {
            setError(error.response?.data?.message || "Failed to update profile");
        }
    };

    const getInitials = (name) => {
        return name ? name.split(" ").map(part => part[0]).join("").toUpperCase() : "U";
    };

    if (loading) return <p className="text-center text-lg">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen  p-2">
            <div className="card w-full max-w-lg bg-base-100 p-2 rounded-xl transition-all">
                
                {/* Profile Section */}
                <div className="flex flex-col items-center mb-4">
                    <div className="w-24 h-24 flex items-center justify-center text-3xl font-bold text-white bg-primary rounded-full">
                        {getInitials(user.name)}
                    </div>
                    <h2 className="text-2xl font-semibold mt-2">{user.name}</h2>
                    <p className="text-gray-500">{user.email}</p>
                </div>

                {/* Test Overview Section */}
                {testsOverview && (
                    <div className="bg-primary/10 p-4 rounded-lg shadow mt-4">
                        <h3 className="text-lg font-semibold">Test Overview</h3>
                        <p>Total Tests Attempted: <span className="font-bold">{testsOverview.totalTests}</span></p>
                        <p>Total Questions Answered: <span className="font-bold">{testsOverview.totalQuestions}</span></p>
                        <p>Correct Answers: <span className="text-green-600 font-bold">{testsOverview.correctAnswers}</span></p>
                        <p>Wrong Answers: <span className="text-red-600 font-bold">{testsOverview.wrongAnswers}</span></p>
                        <p>Unattempted Questions: <span className="text-gray-600 font-bold">{testsOverview.unattempted}</span></p>
                    </div>
                )}

                {/* Profile Editing Section */}
                <div className="space-y-4 mt-6">
                    <label className="block font-semibold">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={user.name || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`input input-bordered w-full ${isEditing ? "border-primary" : "border-base-300"}`}
                    />

                    <label className="block font-semibold">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={user.email || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`input input-bordered w-full ${isEditing ? "border-primary" : "border-base-300"}`}
                    />

                    <label className="block font-semibold">Bio</label>
                    <textarea
                        name="bio"
                        value={user.bio || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`textarea textarea-bordered w-full ${isEditing ? "border-primary" : "border-base-300"}`}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between mt-6">
                    {isEditing ? (
                        <button onClick={saveProfile} className="btn btn-success transition-all">Save</button>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="btn btn-primary transition-all">Edit Profile</button>
                    )}
                </div>
            </div>

            {/* Error Notification */}
            {error && (
                <div className="toast toast-end">
                    <div className="alert alert-error">
                        <span>{error}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
