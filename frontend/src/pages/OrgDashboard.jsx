import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Menu } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import CreateTest from "../components/CreateTest";
import ORGTests from "./ORGTests";
import OrgProfile from "./OrgProfile";

const OrgDashboard = () => {
    const { user, loading } = useAuth();
    const [activePage, setActivePage] = useState("orgProfile");
    const navigate = useNavigate();
    useEffect(() => {
        if (!loading && user) {
            navigate("/dashboard");
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

            <div className="flex lg:flex-row">
                <div className="drawer lg:drawer-open">
                    <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                    
                    <div className="drawer-content flex flex-col p-4 w-full">
                        <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden self-start">
                            <Menu />
                        </label>

                        <div>
                            {activePage === "ORGTests" && <ORGTests />}
                            {activePage === "createTest" && <CreateTest />}
                            {activePage === "orgProfile" && <OrgProfile orgId={user.id} />}

                        </div>

                        <div className="mt-4 text-lg font-semibold text-center text-secondary">
                            Organization: {user?.name}
                        </div>
                    </div>

                    <div className="drawer-side z-50">
                        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                        
                        <ul className="menu bg-base-200 text-base-content bg-white min-h-full w-80 p-4 flex flex-col justify-between">
                            <div className="text-xl font-bold text-center py-4 border-b border-gray-300">
                                Organization Menu
                            </div>

                            <div className="space-y-3 mt-6">
                                <li><a onClick={() => handleSidebarClick("orgProfile")}>Organization Profile</a></li>
                                <li><a onClick={() => handleSidebarClick("createTest")}>Create Test</a></li>
                                <li><a onClick={() => handleSidebarClick("ORGTests")}>Tests</a></li>
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

export default OrgDashboard;
