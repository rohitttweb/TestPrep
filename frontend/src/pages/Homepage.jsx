import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext"; // Import useAuth
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL;
const HomePage = () => {
    const { user } = useAuth(); // Ensure user state is available
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/server/stats`);
                setStats(res.data);
            } catch (err) {
                console.error('Failed to fetch stats:', err);
            }
        };
        fetchStats();
    }, []);
    useEffect(() => {
        // Scroll to the section after the page loads
        const hash = window.location.hash;
        if (hash) {
            const element = document.querySelector(hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, []);


    return (
        <div className="font-sans text-base-content bg-base-200">

            {/* Navbar */}
            <Navbar user={user} />

            {/* Hero Section */}
            <div className="hero min-h-screen bg-base-100">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <img
                        src="1.png"
                        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-sm rounded-lg object-contain"
                        alt="Hero"
                    />
                    <div>
                        <h1 className="text-5xl font-bold">Welcome To TestPrep</h1>
                        <p className="py-6">
                            A Place To Test Your Exam Preparation
                        </p>
                        {user ? (
                            <a href="/dashboard" className="btn btn-primary">
                                Dashboard &gt;&gt;
                            </a>
                        ) : (
                            <a href="/signup" className="btn btn-primary">
                                Get Started &gt;&gt;
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/*About Section */}
            <section id="about" className="py-12 px-8 bg-base-200">
                <div className="container mx-auto text-center">
                    <div className="hero bg-base-200 py-16">
                        <div className="hero-content text-center">
                            <div className="max-w-2xl">
                                <h1 className="text-4xl font-bold">About TestPrep</h1>
                                <p className="py-6 text-lg">
                                    TestPrep is your all-in-one platform for preparing for competitive exams, improving knowledge, and tracking your progress — all in one place.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-12 px-8 bg-base-100">
                <div className="container mx-auto text-center">
                    <h3 className="text-3xl font-semibold mb-4">Key Features</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 max-w-6xl mx-auto">
                        <div className="card bg-base-100 p-6 shadow">
                            <h4 className="text-xl font-bold mb-2">Personalized Tests</h4>
                            <p>Create practice tests tailored to your learning level and goals.</p>
                        </div>
                        <div className="card bg-base-100 p-6 shadow">
                            <h4 className="text-xl font-bold mb-2">Detailed Analytics</h4>
                            <p>Track your strengths, weaknesses, and progress over time.</p>
                        </div>
                        
                        <div className="card bg-base-100 p-6 shadow">
                            <h4 className="text-xl font-bold mb-2">Real Exam Simulation</h4>
                            <p>Practice in a test-like environment to reduce exam-day anxiety.</p>
                        </div>
                        <div className="card bg-base-100 p-6 shadow">
                            <h4 className="text-xl font-bold mb-2">Multi-Device Access</h4>
                            <p>Study anytime, anywhere — on mobile, tablet, or desktop.</p>
                        </div>
                        
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section id="stats" className="py-12 px-8 bg-base-200">
                <div className="container mx-auto text-center">

                    {stats && (
                        <div className="mt-4">
                            <h3 className="text-3xl font-semibold mb-6">Our Numbers</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="stat">
                                    <div className="stat-title">Registered Users</div>
                                    <div className="stat-value text-primary">{stats.totalUsers}</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title">Total Questions</div>
                                    <div className="stat-value text-info">{stats.totalQuestions}</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title">Test Attempts</div>
                                    <div className="stat-value text-warning">{stats.testAttemptsByUsers}</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title">Organizations</div>
                                    <div className="stat-value text-secondary">{stats.totalOrganizations}</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title">Tests Created by Organisations</div>
                                    <div className="stat-value text-accent">{stats.totalTests}</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title">Total Organisations Tests Attempted</div>
                                    <div className="stat-value text-success">{stats.totalAttempts}</div>
                                </div>
                             
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-12 px-8 bg-base-100">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 max-w-6xl mx-auto">
                        <div className="card bg-base-100 p-6 shadow">
                            <p className="text-lg italic">"TestPrep has transformed my study routine!"</p>
                            <h4 className="text-xl font-bold mt-4">- Alex J.</h4>
                        </div>
                        <div className="card bg-base-100 p-6 shadow">
                            <p className="text-lg italic">"The personalized tests are a game-changer!"</p>
                            <h4 className="text-xl font-bold mt-4">- Sarah K.</h4>
                        </div>
                        <div className="card bg-base-100 p-6 shadow">
                            <p className="text-lg italic">"I love the detailed analytics!"</p>
                            <h4 className="text-xl font-bold mt-4">- John D.</h4>
                        </div>
                        <div className="card bg-base-100 p-6 shadow">
                            <p className="text-lg italic">"The community support is fantastic!"</p>
                            <h4 className="text-xl font-bold mt-4">- Emily R.</h4>
                        </div>
                        <div className="card bg-base-100 p-6 shadow">
                            <p className="text-lg italic">"I can study anywhere, anytime!"</p>
                            <h4 className="text-xl font-bold mt-4">- Michael T.</h4>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-12 px-8 bg-base-200">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4 mt-8">Contact Us</h2>
                    <p className="text-lg mb-6">Have questions or feedback? We’d love to hear from you!</p>
                    <div className="card bg-base-100 p-6 max-w-lg mx-auto shadow-lg">
                        <form>
                            <div className="form-control mb-4">
                                <label className="label">Name</label>
                                <input type="text" className="input input-bordered" placeholder="Your Name" />
                            </div>
                            <div className="form-control mb-4">
                                <label className="label">Email</label>
                                <input type="email" className="input input-bordered" placeholder="Your Email" />
                            </div>
                            <div className="form-control mb-4">
                                <label className="label">Message</label>
                                <textarea className="textarea textarea-bordered" rows="4" placeholder="Your Message"></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary w-full">Submit</button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer bg-neutral text-neutral-content p-10 justify-center">
               
                <aside className="grid-flow-col items-center">
                    <p>Copyright © {new Date().getFullYear()} - All rights reserved</p>
                </aside>
            </footer>
        </div>
    );
};

export default HomePage;
