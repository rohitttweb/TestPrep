import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { House } from 'lucide-react';
import axios from "axios"; // Import Axios

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_BASE_URL = import.meta.env.VITE_API_URL // Load API URL from .env

const TestPage = () => {
    const divRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const enterFullscreen = () => {
        if (divRef.current && divRef.current.requestFullscreen) {
            divRef.current.requestFullscreen();
            setIsFullscreen(true);
        }
    };

    const exitFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const query = new URLSearchParams(useLocation().search);
    const Topic = query.get("Topic");
    const subTopic = query.get("subTopic");
    const testlength = query.get("testlength");

    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [correctQuestion, setCorrectQuestion] = useState(0);
    const [wrongQuestion, setWrongQuestion] = useState(0);
    const [unattempted, setUnattempted] = useState(0);
    const [totalTime, setTotalTime] = useState(300);
    //const [questionTime, setQuestionTime] = useState(60);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/usertests/questions?Topic=${Topic}&subTopic=${subTopic}&testlength=${testlength}`
                );
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                setQuestions(data.data);
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchQuestions();
        // Add a small delay to ensure the user is interacting with the page before fullscreen
        setTimeout(() => {
            enterFullscreen();
        }, 100);

    }, []);

    useEffect(() => {
        if (submitted) return;
        const totalTimer = setInterval(() => {
            setTotalTime((prev) => (prev > 0 ? prev - 1 : 0));
            if (totalTime <= 1) {
                clearInterval(totalTimer);
                handleSubmit('timeout');
            }
        }, 1000);
        return () => clearInterval(totalTimer);
    }, [submitted, totalTime]);

/*     useEffect(() => {
        if (submitted) return;
        const questionTimer = setInterval(() => {
            setQuestionTime((prev) => (prev > 0 ? prev - 1 : 60));
            if (questionTime <= 1) {
                if (currentQuestion < questions.length - 1) {
                    setCurrentQuestion((prev) => prev + 1);
                    setQuestionTime(60);
                } else {
                    handleSubmit();
                }
            }
        }, 1000);
        return () => clearInterval(questionTimer);
    }, [submitted, questionTime, currentQuestion, questions.length]); */

    const handleOptionChange = (option) => setAnswers({ ...answers, [currentQuestion]: option });

    function getUserToken() {
        const cookies = document.cookie.split("; ");
        if (!cookies.length < 0) {
            return false;
        }
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].split("=");
            if (cookie[0] === "UserToken") {
                const Token = cookie[1];
                return Token;
            }
        }
        return false;
    }
    const handleSubmit = async (eventType) => {
        setSubmitted(true);
        console.log(eventType)
        let totalScore = 0, correct = 0, wrong = 0;

        const formattedQuestions = questions.map((question, index) => {
            const userAnswer = answers[index] || ""; // Handle unattempted questions
            if (userAnswer === question.ans) {
                totalScore += 1;
                correct += 1;
            } else if (userAnswer) {
                totalScore -= 0.25;
                wrong += 1;
            }

            return {
                questionText: question.question,
                options: question.options,
                correctAnswer: question.ans,
                userSelectedAnswer: userAnswer,
            };
        });

        setCorrectQuestion(correct);
        setWrongQuestion(wrong);
        setUnattempted(questions.length - (correct + wrong));
        setScore(totalScore);
        exitFullscreen();

        // 📌 Send test data to backend using Axios
        try {
            const response = await axios.post(`${API_BASE_URL}/api/usertests/submit`, {
                topic: Topic,
                subTopic: subTopic,
                totalQuestions: questions.length,
                correctAnswers: correct,
                wrongAnswers: wrong,
                unattempted: questions.length - (correct + wrong),
                score: totalScore,
                submittedEvent: eventType, 
                questions: formattedQuestions, // Send questions with selected answers
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getUserToken()}`,
                },
            });

            console.log("Test submitted successfully:", response.data);

        } catch (error) {
            console.error("Error submitting test:", error.response?.data || error.message);
        }
    };


    const handleSubmitRef = useRef(handleSubmit);

    useEffect(() => {
        handleSubmitRef.current = handleSubmit; // Always points to the latest function
    }, [handleSubmit]);

    useEffect(() => {
        const handleBlur = () => {
            if (!submitted) {
                handleSubmitRef.current("window_blur"); // ✅ Calls latest handleSubmit function
            }
        };

        window.addEventListener("blur", handleBlur);

        return () => {
            window.removeEventListener("blur", handleBlur);
        };
    }, [submitted]); // Runs when `submitted` changes



    return (
        <div ref={divRef} className="flex flex-col items-center justify-center min-h-screen bg-white-200 p-4">
            <div className="w-full max-w-4xl bg-base-100 p-6 rounded-lg ">
                {!submitted ? (
                    <>
                        {/* Timers */}
                        <p className="p-4 text-3xl font-bold text-center">TestPrep</p>

                        <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-3 mb-4">
                            <span className="badge badge-error text-base sm:text-lg px-6 py-3 w-full sm:w-auto text-center">
                                Total Time: {Math.floor(totalTime / 60)}:{String(totalTime % 60).padStart(2, '0')}
                            </span>
                            {/* <span className="badge badge-info text-base sm:text-lg px-6 py-3 w-full sm:w-auto text-center">
                                Question Time: {questionTime}s
                            </span> */}
                        </div>


                        {/* Question Section */}
                        <div className="card  p-4">
                            <h1 className="text-xl font-bold text-primary">
                                Question {currentQuestion + 1} of {questions.length}
                            </h1>
                            <p className="mt-2 text-lg">{questions[currentQuestion]?.question}</p>

                            <div className="mt-4 space-y-2">
                                {questions[currentQuestion]?.options.map((option, index) => (
                                    <label key={index} className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-100">
                                        <input
                                            type="radio"
                                            name={`question-${currentQuestion}`}
                                            value={option}
                                            checked={answers[currentQuestion] === option}
                                            onChange={() => handleOptionChange(option)}
                                            className="mr-2"
                                        />
                                        {option}
                                    </label>
                                ))}
                            </div>

                            {/* Navigation Buttons */}
                            <div className="mt-6">
                                {/* Previous & Next Buttons (Aligned Left) */}
                                <div className="flex justify-start gap-4 mb-4">
                                    {currentQuestion > 0 && (
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => setCurrentQuestion((prev) => Math.max(prev - 1, 0))}
                                        >
                                            Previous
                                        </button>
                                    )}

                                    {currentQuestion < questions.length - 1 && (
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => setCurrentQuestion((prev) => Math.min(prev + 1, questions.length - 1))}
                                        >
                                            Next
                                        </button>
                                    )}
                                </div>

                                {/* Submit Button (Full Width) */}
                                <button className="btn btn-success w-full" onClick={() => handleSubmit('submit_button')}>
                                    Submit
                                </button>
                            </div>


                        </div>
                    </>
                ) : (
                    <>
                        {/* Results Section */}
                        <div className="fixed top-5 left-5 z-50">
                            <a href="/dashboard"><House /></a>
                        </div>
                        <h1 className="text-2xl font-bold text-center text-primary my-4">Test Results</h1>

                        <div className="stats  flex flex-col md:flex-row gap-4 p-4">
                            <div className="stat">
                                <div className="stat-title">Total Questions</div>
                                <div className="stat-value text-natural">{questions.length}</div>
                            </div>
                            <div className="stat">
                                <div className="stat-title">Total Correct</div>
                                <div className="stat-value text-success">{correctQuestion}</div>
                            </div>
                            <div className="stat">
                                <div className="stat-title">Total Wrong</div>
                                <div className="stat-value text-error">{wrongQuestion}</div>
                            </div>
                            <div className="stat">
                                <div className="stat-title">Total Score</div>
                                <div className="stat-value text-success">{score}</div>
                            </div>
                        </div>

                        {/* Results Table */}
                        {/* <div className="mt-6 px-4">
                            <div className="overflow-x-auto">
                                <table className="table w-full border border-gray-300">
                                    <thead>
                                        <tr className="bg-base-200">
                                            <th className="p-2 text-left">Metric</th>
                                            <th className="p-2 text-left">Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="hover">
                                            <td className="p-2">Total Correct</td>
                                            <td className="p-2">{correctQuestion}</td>
                                        </tr>
                                        <tr className="hover">
                                            <td className="p-2">Total Wrong</td>
                                            <td className="p-2">{wrongQuestion}</td>
                                        </tr>
                                        <tr className="hover">
                                            <td className="p-2">Total Questions</td>
                                            <td className="p-2">{questions.length}</td>
                                        </tr>
                                        <tr className="hover">
                                            <td className="p-2 font-semibold">Total Score</td>
                                            <td className="p-2 font-semibold">{score}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div> */}


                        {/* Bar Chart */}
                        <div className="mt-6 flex justify-center">
                            <div className="w-full">
                                <Bar
                                    data={{
                                        labels: ["Correct", "Wrong", "Unattempted"],
                                        datasets: [
                                            {
                                                data: [correctQuestion, wrongQuestion, unattempted],
                                                backgroundColor: ["#4CAF50", "#F44336", "#3F51B5"],
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false, // Allows better resizing
                                        plugins: { legend: { display: false } },
                                        scales: {
                                            y: {
                                                min: 0,
                                                max: questions.length,
                                                ticks: {
                                                    stepSize: 1,
                                                },
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>


                        {/* Answers Review */}
                        <div className="mt-6">
                            {questions.map((question, index) => (
                                <div key={index} className="card  p-4 mb-2">
                                    <p className="font-semibold">{`Q${index + 1}: ${question.question}`}</p>
                                    <ul className="space-y-2">
                                        {question.options.map((option, idx) => (
                                            <li
                                                key={idx}
                                                className={`p-2 border rounded 
                                                        ${answers[index] === option
                                                        ? option === question.ans
                                                            ? "bg-green-100 border-green-500 text-green-600" // Correct answer chosen
                                                            : "bg-red-100 border-red-500 text-red-600" // Incorrect answer chosen
                                                        : "bg-base-100 border-base-300"
                                                    } daisyui-btn`}
                                            >
                                                {option}
                                            </li>
                                        ))}
                                    </ul>

                                    <p className="text-sm p-2">Correct Answer: <span className="text-primary">{question.ans}</span></p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TestPage;
