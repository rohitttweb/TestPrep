import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const API_BASE_URL = process.env.API_URL; // Load from .env

const TopicsList = () => {
    const [topics, setTopics] = useState([]);
    const [activeTopic, setActiveTopic] = useState(null);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/usertests/topics`);
                const data = await response.json();
                console.log(data);
                setTopics(data);
                if (data.length > 0) {
                    setActiveTopic(data[0].mainTopic); // Default to first topic
                }
            } catch (error) {
                console.error("Error fetching topics:", error);
            }
        };

        fetchTopics();
    }, []);

    return (
        <>
            <div className="container mx-auto px-4 py-6">
                <h1 className="text-3xl font-bold text-center text-primary mb-4">Topics</h1>

                {/* Tabs for Main Topics - Scrollable on Mobile */}
                <div className="overflow-x-auto whitespace-nowrap flex gap-2 md:justify-center">
                    <div role="tablist" className="tabs tabs-lifted w-full md:w-auto flex-nowrap">
                        {topics.map((topic) => (
                            <button
                                key={topic.mainTopic}
                                role="tab"
                                className={`tab px-4 py-2 text-sm md:text-lg font-semibold transition ${
                                    topic.mainTopic === activeTopic ? "tab-active" : ""
                                }`}
                                onClick={() => setActiveTopic(topic.mainTopic)}
                            >
                                {topic.mainTopic}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Subtopics Section */}
                <div className="p-4 md:p-6 bg-base-100 rounded-lg  mt-4 md:mt-6">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4 text-center">
                        {activeTopic?.toUpperCase()}
                    </h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                        {topics
                            .find((t) => t.mainTopic === activeTopic)
                            ?.subTopics.map((subTopic, index) => (
                                <li key={index} className="card bg-primary text-white hover:bg-secondary transition">
                                    <Link
                                        to={`/testpage?Topic=${activeTopic}&subTopic=${subTopic}&testlength=5`}
                                        className="card-body text-center font-medium"
                                    >
                                        {subTopic}
                                    </Link>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default TopicsList;
