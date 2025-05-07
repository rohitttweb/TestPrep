import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL

export default function AboutPage() {
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-base-100 text-base-content">
        {/* Hero Section */}
        <div className="hero bg-base-200 py-16">
          <div className="hero-content text-center">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-bold">About TestPrep</h1>
              <p className="py-6 text-lg">
                TestPrep is your all-in-one platform for preparing for competitive exams, improving knowledge, and tracking your progress — all in one place.
              </p>
            </div>
          </div>
        </div>

        {/* Who We Are */}
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">Who We Are</h2>
            <p className="mt-4 text-lg">
              We're a team of educators and developers passionate about helping students succeed.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="card bg-base-100 shadow">
              <div className="card-body items-center text-center">
                <h2 className="card-title">Accessible Learning</h2>
                <p>Resources made easy for all levels — from quick quizzes to full mock exams.</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow">
              <div className="card-body items-center text-center">
                <h2 className="card-title">Smart Analytics</h2>
                <p>Track your performance and discover areas to improve with powerful insights.</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow">
              <div className="card-body items-center text-center">
                <h2 className="card-title">Built for You</h2>
                <p>We're constantly evolving to bring you the best prep experience possible.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-base-200 py-12">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Impact in Numbers</h2>
            {stats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="stat">
                  <div className="stat-title">Registered Users</div>
                  <div className="stat-value text-primary">{stats.totalUsers}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Registered Organizations</div>
                  <div className="stat-value text-secondary">{stats.totalOrganizations}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Tests Created</div>
                  <div className="stat-value text-accent">{stats.totalTests}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Tests Attempted</div>
                  <div className="stat-value text-success">{stats.totalAttempts}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Total questions</div>
                  <div className="stat-value text-success">{stats.totalQuestions}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Tests Attempted by user</div>
                  <div className="stat-value text-success">{stats.testAttemptsByUsers}</div>
                </div>
              </div>
            ) : (
              <p>Loading statistics...</p>
            )}
          </div>
        </div>

        {/* Contact Section */}
      </div>
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
    </>
  );
}
