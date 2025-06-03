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
        <div className="font-sans text-base-content bg-white">

            {/* Navbar */}
            <Navbar user={user} />

            {/* Hero Section */}
            <section className=" py-20 px-6  bg-white">
                <div className="  hero-content flex-col lg:flex-row-reverse max-w-7xl mx-auto px-6">
                    <img
                        src="1.png"
                        alt="Hero"
                        className=" w-full max-w-xs sm:max-w-md lg:max-w-lg rounded-lg object-contain"
                    />
                    <div className="text-center lg:text-left lg:pr-12 mt-8 lg:mt-0">
                        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
                            Welcome To TestPrep
                        </h1>
                        <p className="py-6 text-lg text-gray-700 max-w-md mx-auto lg:mx-0">
                            A Place To Test Your Exam Preparation
                        </p>
                        {user ? (
                            <a href="/dashboard" className="btn btn-primary btn-lg">
                                Dashboard &gt;&gt;
                            </a>
                        ) : (
                            <a href="/signup" className="btn btn-primary btn-lg">
                                Get Started &gt;&gt;
                            </a>
                        )}
                    </div>
                </div>
            </section>


            {/* About Section */}
            <section id="about" className=" py-20 px-6 bg-white">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-col lg:flex-row items-center gap-12 bg-white p-10 rounded-2xl ">

                        {/* Left Side: Image */}
                        <div className="border-2 border-gray-700 rounded-lg m-3 w-full lg:w-1/2">
                            <img
                                src="about.png" // replace with your actual image path
                                alt="About TestPrep"
                                className="w-full h-auto rounded-xl object-cover"
                            />
                        </div>

                        {/* Right Side: Text */}
                        <div className="w-full lg:w-1/2 text-center lg:text-left">
                            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">About TestPrep</h2>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                TestPrep is your all-in-one platform for preparing for competitive exams, enhancing your knowledge,
                                and tracking your progress — all in one place. Whether you're preparing for government exams, academic
                                challenges, or corporate assessments, TestPrep offers powerful tools to help you succeed.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className=" py-16 px-6 bg-white relative">
                <div className="container mx-auto max-w-7xl text-center">
                    <h3 className="border-2 border-gray-700 rounded-lg m-3 p-4 text-4xl font-extrabold text-gray-900 mb-10">Key Features</h3>

                    <div className="relative">
                        {/* Scroll Container */}
                        <div
                            id="featureScroll"
                            className="flex gap-6 overflow-x-auto scrollbar-hide px-2 sm:px-0 scroll-smooth"
                        >
                            {[
                                {
                                    title: "Personalized Tests",
                                    desc: "Create practice tests tailored to your learning level and goals.",
                                    icon: "📝",
                                },
                                {
                                    title: "Detailed Analytics",
                                    desc: "Track your strengths, weaknesses, and progress over time.",
                                    icon: "📊",
                                },
                                {
                                    title: "Real Exam Simulation",
                                    desc: "Practice in a test-like environment to reduce exam-day anxiety.",
                                    icon: "⏳",
                                },
                                {
                                    title: "Multi-Device Access",
                                    desc: "Study anytime, anywhere — on mobile, tablet, or desktop.",
                                    icon: "📱",
                                },
                                {
                                    title: "Daily Challenges",
                                    desc: "Boost consistency and learning with bite-sized daily tasks.",
                                    icon: "🎯",
                                },
                                {
                                    title: "Gamified Rewards",
                                    desc: "Earn badges and achievements as you hit learning milestones.",
                                    icon: "🏆",
                                },
                            ].map(({ title, desc, icon }) => (
                                <div
                                    key={title}
                                    className="border-2 border-gray-700 rounded-lg m-3 bg-white p-6 my-6 min-w-[250px] sm:min-w-[300px] rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                                >
                                    <div className="text-5xl mb-4">{icon}</div>
                                    <h4 className="text-2xl font-semibold mb-3 text-gray-900">{title}</h4>
                                    <p className="text-gray-700 text-sm">{desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Scroll Arrows */}

                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section id="stats" className="  py-16 px-6 bg-white relative">
                <div className="container mx-auto max-w-7xl text-center">
                    {stats && (
                        <>
                            <h3 className="border-2 border-gray-700 rounded-lg m-3 p-4 text-4xl font-extrabold text-gray-900 mb-10">Our Numbers</h3>

                            <div className="relative">
                                {/* Scroll container */}
                                <div
                                    id="statsScroll"
                                    className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-2 sm:px-0"
                                >
                                    {[
                                        {
                                            title: "Registered Users",
                                            value: stats.totalUsers,
                                            color: "text-blue-600",
                                        },
                                        {
                                            title: "Total Questions",
                                            value: stats.totalQuestions,
                                            color: "text-teal-600",
                                        },
                                        {
                                            title: "Test Attempts",
                                            value: stats.testAttemptsByUsers,
                                            color: "text-yellow-500",
                                        },
                                        {
                                            title: "Organizations",
                                            value: stats.totalOrganizations,
                                            color: "text-purple-600",
                                        },
                                        {
                                            title: "Tests Created by Organizations",
                                            value: stats.totalTests,
                                            color: "text-pink-600",
                                        },
                                        {
                                            title: "Total Organizations Tests Attempted",
                                            value: stats.totalAttempts,
                                            color: "text-green-600",
                                        },
                                    ].map(({ title, value, color }, idx) => (
                                        <div
                                            key={idx}
                                            className="border-2 border-gray-700 rounded-lg m-3 min-w-[250px] sm:min-w-[300px] bg-white p-8 my-6 rounded-lg shadow-md"
                                        >
                                            <div className="text-gray-500 font-semibold mb-2 uppercase tracking-wide">
                                                {title}
                                            </div>
                                            <div className={`text-4xl font-bold ${color}`}>{value.toLocaleString()}</div>
                                        </div>
                                    ))}
                                </div>


                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="  py-16 px-6 bg-white relative">
                <div className="container mx-auto max-w-7xl text-center">
                    <h2 className="border-2 border-gray-700 rounded-lg m-3 p-4 text-4xl font-extrabold text-gray-900 mb-12">What Our Users Say</h2>

                    <div className="relative">
                        {/* Scroll container */}
                        <div
                            id="testimonialScroll"
                            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-2 sm:px-0"
                        >
                            {[
                                { quote: "TestPrep has transformed my study routine!", name: "Alex J.", bg: "bg-pink-100" },
                                { quote: "The personalized tests are a game-changer!", name: "Sarah K.", bg: "bg-green-100" },
                                { quote: "I love the detailed analytics!", name: "John D.", bg: "bg-blue-100" },
                                { quote: "The community support is fantastic!", name: "Emily R.", bg: "bg-yellow-100" },
                                { quote: "I can study anywhere, anytime!", name: "Michael T.", bg: "bg-purple-100" },
                            ].map(({ quote, name, bg }, idx) => (
                                <div
                                    key={idx}
                                    className={`${bg} border-2 border-gray-700 rounded-lg m-3 my-6 min-w-[250px] sm:min-w-[300px] p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300`}
                                >
                                    <p className="text-lg italic text-gray-800 mb-6">“{quote}”</p>
                                    <h4 className="text-xl font-semibold text-gray-900">- {name}</h4>
                                </div>
                            ))}
                        </div>


                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className=" py-16 px-6 bg-white">
                <div className="container mx-auto max-w-xl text-center">
                    <h2 className="text-4xl font-extrabold mb-6 text-gray-900">Contact Us</h2>
                    <p className="text-lg mb-10 text-gray-700">Have questions or feedback? We’d love to hear from you!</p>
                    <div className="border-2 border-gray-700 rounded-lg m-2 bg-white p-8 rounded-xl shadow-sm">
                        <form>
                            <div className="form-control mb-6 text-left">
                                <label className="label font-semibold text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    className="border-2 border-gray-700 rounded-lg m-2 input input-bordered w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div className="form-control mb-6 text-left">
                                <label className="label font-semibold text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    className="border-2 border-gray-700 rounded-lg m-2 input input-bordered w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md"
                                    placeholder="Your Email"
                                />
                            </div>
                            <div className="form-control mb-6 text-left">
                                <label className="label font-semibold text-gray-700 mb-1">Message</label>
                                <textarea
                                    rows={4}
                                    className="border-2 border-gray-700 rounded-lg m-2 textarea textarea-bordered w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md"
                                    placeholder="Your Message"
                                ></textarea> 
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary w-full py-3 text-lg font-semibold"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </section>

           <footer className="bg-neutral text-neutral-content py-8 px-6">
                <div className="container mx-auto max-w-7xl text-center">
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-sm">
                            &copy; {new Date().getFullYear()} TestPrep. All rights reserved.
                        </p>
                        
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default HomePage;
