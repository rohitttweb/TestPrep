import React from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext"; // Import useAuth

const HomePage = () => {
    const { user } = useAuth(); // Ensure user state is available

    return (
        <div className="font-sans text-base-content bg-base-200">
            
            {/* Navbar */}
            <Navbar user={user} />

            {/* Hero Section */}
            <div className="hero min-h-screen bg-base-200">
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

            {/* About Section */}
            <section id="about" className="py-12 px-8 bg-base-100">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6">About Us</h2>
                    <div className="card bg-base-100 p-6 max-w-xl mx-auto shadow-lg">
                        <p className="leading-relaxed">
                            TestPrep is a platform designed to help students excel in their exams.
                            With personalized practice tests, detailed analytics, and expert guidance,
                            we ensure you're well-prepared to achieve your academic goals.
                        </p>
                        <p className="mt-4 leading-relaxed">
                            Join thousands of students who trust TestPrep to enhance their learning and boost their confidence.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-12 px-8 bg-base-200">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
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
            <footer className="footer bg-neutral text-neutral-content p-10">
                <nav>
                    <h6 className="footer-title">Services</h6>
                    <a className="link link-hover">Branding</a>
                    <a className="link link-hover">Design</a>
                    <a className="link link-hover">Marketing</a>
                    <a className="link link-hover">Advertisement</a>
                </nav>
                <nav>
                    <h6 className="footer-title">Company</h6>
                    <a className="link link-hover">About us</a>
                    <a className="link link-hover">Contact</a>
                    <a className="link link-hover">Jobs</a>
                    <a className="link link-hover">Press kit</a>
                </nav>
                <nav>
                    <h6 className="footer-title">Legal</h6>
                    <a className="link link-hover">Terms of use</a>
                    <a className="link link-hover">Privacy policy</a>
                    <a className="link link-hover">Cookie policy</a>
                </nav>
                <aside className="grid-flow-col items-center">
                    <p>Copyright © {new Date().getFullYear()} - All rights reserved</p>
                </aside>
            </footer>
        </div>
    );
};

export default HomePage;
