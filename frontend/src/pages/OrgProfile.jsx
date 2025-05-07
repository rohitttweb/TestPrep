import React, { useEffect, useState } from 'react';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function OrgProfile({ orgId }) {
    const [stats, setStats] = useState(null);
  
    useEffect(() => {
      const fetchStats = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/org/${orgId}/profile`);
          setStats(res.data);
        } catch (err) {
          console.error('Failed to fetch org stats:', err);
        }
      };
      fetchStats();
    }, [orgId]);
  
    if (!stats) return <p>Loading...</p>;
  
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Organization Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card bg-base-200 p-4">
            <h3 className="text-lg font-medium">Total Tests</h3>
            <p className="text-2xl">{stats.totalTests}</p>
          </div>
          <div className="card bg-base-200 p-4">
            <h3 className="text-lg font-medium">Total Attempts</h3>
            <p className="text-2xl">{stats.totalAttempts}</p>
          </div>
        </div>
      </div>
    );
  }
  