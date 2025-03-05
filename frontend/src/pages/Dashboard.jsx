import React, { useState, useEffect } from "react";
import TopicsList from "../components/TopicsList";
import Navbar from "../components/Navbar";
import ChatbotInstructor from "../components/ChatbotInstructor";
import { Menu } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import UserProfile from "./UserProfile";
import RecentTests from "../components/RecentTests";
import { useAuth } from "../context/AuthContext"; // Import AuthContext
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { user, loading } = useAuth(); // Get user from context
    const [activePage, setActivePage] = useState("topics");
    const navigate = useNavigate()
    useEffect(() => {
        if (!loading && user) {
            navigate("/dashboard"); // Redirect authenticated users
        }
    }, [user, loading, navigate]);


    if (loading) return <div>Loading...</div>;


    const handleSidebarClick = (page) => {
        setActivePage(page);
        const drawerCheckbox = document.getElementById("my-drawer-2");
        if (drawerCheckbox) {
            drawerCheckbox.checked = false;
        }
    };

    return (
        <>
            <Navbar user={user} />

            <div className="flex lg:flex-row ">

                <div className="drawer lg:drawer-open">
                    <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

                    <div className="drawer-content flex flex-col p-4 w-full">
                        <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden self-start ">
                            <Menu />
                        </label>

                        <div className="">
                            {activePage === "topics" && <TopicsList />}
                            {activePage === "Instructor" && <ChatbotInstructor />}
                            {activePage === "profile" && <UserProfile />}
                            {activePage === "recentTest" && <RecentTests />}
                        </div>

                        <div className="mt-4 text-lg font-semibold text-center text-secondary">
                            User: {user.name}
                        </div>
                    </div>

                    <div className="drawer-side z-50">
                        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>

                        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 flex flex-col justify-between">
                            <div className="text-xl font-bold text-center py-4 border-b border-gray-300">
                                Dashboard Menu
                            </div>

                            <div className="space-y-3 mt-6">
                                <li><a onClick={() => handleSidebarClick("topics")}>Topics List</a></li>
                                <li><a onClick={() => handleSidebarClick("recentTest")}>Recent Tests</a></li>
                                <li><a onClick={() => handleSidebarClick("profile")}>Profile</a></li>
                                <li><a onClick={() => handleSidebarClick("Instructor")}>Instructor Section</a></li>
                            </div>

                            <button className="bg-transparent hover:bg-transparent focus:outline-none mt-auto">
                                <ThemeToggle />
                            </button>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
