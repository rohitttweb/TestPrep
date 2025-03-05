import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL // Load API URL from .env


const RecentTests = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTest, setSelectedTest] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const testsPerPage = 10;
    const modalRef = useRef(null); // Ref for modal

    const getUserToken = () => {
        const cookies = document.cookie.split("; ");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].split("=");
            if (cookie[0] === "UserToken") {
                return cookie[1];
            }
        }
        return false;
    };

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/usertests/attempts`, {
                    headers: {
                        Authorization: `Bearer ${getUserToken()}`,
                        "Content-Type": "application/json",
                    },
                });

                setTests(response.data.tests || []);
            } catch (error) {
                console.error("Error fetching tests:", error);
                setTests([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTests();
    }, []);

    const handleViewDetails = (test) => {
        setSelectedTest(test);
        if (modalRef.current) {
            modalRef.current.showModal(); // Open modal safely
        }
    };

    const handleCloseModal = () => {
        if (modalRef.current) {
            modalRef.current.close();
        }
    };

    const indexOfLastTest = currentPage * testsPerPage;
    const indexOfFirstTest = indexOfLastTest - testsPerPage;
    const currentTests = Array.isArray(tests) ? tests.slice(indexOfFirstTest, indexOfLastTest) : [];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-center">Recent Tests</h1>

            {loading ? (
                <p className="text-center">Loading...</p>
            ) : tests.length === 0 ? (
                <p className="text-center">No tests found.</p>
            ) : (
                <>
                    <div className="mt-4 space-y-4">
                        {currentTests.map((test) => (
                            <div key={test._id} className="p-4 border rounded-lg shadow bg-base-200">
                                <h2 className="text-lg font-semibold">{test.topic} - {test.subTopic}</h2>
                                <p>Total Questions: {test.totalQuestions}</p>
                                <p>Correct: {test.correctAnswers} | Wrong: {test.wrongAnswers} | Unattempted: {test.unattempted}</p>
                                <p>Score: <span className="font-bold">{test.score}</span></p>
                                <p className="text-sm text-gray-500">Submitted on: {new Date(test.submittedAt).toLocaleString()}</p>
                                <button onClick={() => handleViewDetails(test)} className="btn btn-primary mt-2">View Details</button>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {tests.length > testsPerPage && (
                        <div className="mt-6 flex justify-center space-x-2">
                            <button
                                className="btn btn-sm"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                Previous
                            </button>
                            <span className="text-lg font-semibold">{currentPage}</span>
                            <button
                                className="btn btn-sm"
                                disabled={indexOfLastTest >= tests.length}
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Modal for Test Details */}
            <dialog ref={modalRef} className="modal">
                <div className="modal-box">
                    {selectedTest && (
                        <>
                            <h3 className="text-lg font-bold">{selectedTest.topic} - {selectedTest.subTopic}</h3>
                            <p className="text-sm text-gray-500">Submitted on: {new Date(selectedTest.submittedAt).toLocaleString()}</p>

                            <div className="mt-4 space-y-3">
                                {selectedTest.questions.map((q, index) => (
                                    <div key={index} className="p-3 border rounded-lg bg-base-100">
                                        <p className="font-semibold">{index + 1}. {q.questionText}</p>
                                        <ul className="mt-2 space-y-1">
                                            {q.options.map((option, idx) => (
                                                <li
                                                    key={idx}
                                                    className={`p-2 rounded ${q.correctAnswer === option ? "bg-green-300" : q.userSelectedAnswer === option ? "bg-red-300" : "bg-gray-200"}`}
                                                >
                                                    {option}
                                                </li>
                                            ))}
                                        </ul>
                                        <p className="text-sm text-gray-600">Correct Answer: <strong>{q.correctAnswer}</strong></p>
                                        <p className="text-sm text-gray-600">Your Answer: <strong>{q.userSelectedAnswer || "Unattempted"}</strong></p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    <div className="modal-action">
                        <button className="btn btn-error" onClick={handleCloseModal}>Close</button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default RecentTests;
