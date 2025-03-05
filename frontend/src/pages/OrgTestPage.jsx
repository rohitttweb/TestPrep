import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate,useLocation } from "react-router-dom";
import axios from "axios";


const API_BASE_URL = import.meta.env.VITE_API_URL

const OrgTestPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [alreadyAttempted, setAlreadyAttempted] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [messageColor, setMessageColor] = useState("green");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalTimeLeft, setTotalTimeLeft] = useState(300);
  const [testStarted, setTestStarted] = useState(false);
  const hasSubmitted = useRef(false);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const token = getUserToken();
        if (!token) {
          localStorage.setItem("redirectAfterLogin", location.pathname); // Store current page
          navigate("/login");
          return;
        }

        const { data } = await axios.get(`${API_BASE_URL}/api/org/test/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setTest(data);
        setAnswers(data.questions.reduce((acc, q) => ({ ...acc, [q._id]: "" }), {}));
        setTotalTimeLeft(data.testLength * 60);

        // Check if the user has already attempted the test
        const attemptResponse = await axios.get(`${API_BASE_URL}/api/org/attempts/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (attemptResponse.data.attempted) {
          setAlreadyAttempted(true);
        }
      } catch (error) {
        console.error("Error fetching test:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [id, navigate]);

  useEffect(() => {
    if (!testStarted || submitted) return;
    const timer = setInterval(() => {
      setTotalTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit("timeout");
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [testStarted, submitted]);

  useEffect(() => {
    const handleBlur = () => {
      if (testStarted && !submitted) {
        handleSubmit("window_blur");
      }
    };
    window.addEventListener("blur", handleBlur);
    return () => window.removeEventListener("blur", handleBlur);
  }, [testStarted, submitted]);

  const handleChange = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  function getUserToken() {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
      const [name, value] = cookies[i].split("=");
      if (name === "UserToken") return value;
    }
    return false;
  }

  const startTest = () => {
    setTestStarted(true);
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

  const handleSubmit = async (eventType) => {
    if (hasSubmitted.current) return;
    hasSubmitted.current = true;
    setSubmitted(true);

    // Exit full-screen mode after submission
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }

    try {
      await axios.post(
        `${API_BASE_URL}/api/org/attempt`,
        { testId: id, answers, submittedEvent: eventType },
        { headers: { Authorization: `Bearer ${getUserToken()}`, "Content-Type": "application/json" } }
      );
      setSubmissionMessage(
        eventType === "window_blur" ? "Test submitted due to window blur!" : "Test submitted successfully!"
      );
      setMessageColor(eventType === "window_blur" ? "red" : "green");
    } catch (error) {
      setSubmissionMessage("Failed to submit test. Please try again.");
      setMessageColor("red");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!test) return <p>Test not found</p>;

  return (
    <div className="p-6 mt-6 rounded-lg max-w-3xl mx-auto">
      {alreadyAttempted ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">You have already attempted this test.</h2>
          <button onClick={() => navigate("/dashboard")} className="btn btn-primary mt-4">
            Back to Dashboard
          </button>
        </div>
      ) : submitted ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold" style={{ color: messageColor }}>{submissionMessage}</h2>
          <button onClick={() => navigate("/dashboard")} className="btn btn-primary mt-4">
            Back to Dashboard
          </button>
        </div>
      ) : testStarted ? (
        <>
          <p>Time Left: {Math.floor(totalTimeLeft / 60)}:{String(totalTimeLeft % 60).padStart(2, "0")}</p>
          <div className="p-4 bg-gray-100 rounded-lg mt-4">
            <p>Q{currentQuestionIndex + 1}: {test.questions[currentQuestionIndex].question}</p>
            {test.questions[currentQuestionIndex].options.map((option, idx) => (
              <label key={idx} className="block p-2 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${test.questions[currentQuestionIndex]._id}`}
                  value={option}
                  checked={answers[test.questions[currentQuestionIndex]._id] === option}
                  onChange={() => handleChange(test.questions[currentQuestionIndex]._id, option)}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <button className="btn btn-secondary" onClick={() => setCurrentQuestionIndex((i) => Math.max(i - 1, 0))}>
              Previous
            </button>
            <button className="btn btn-primary" onClick={() => setCurrentQuestionIndex((i) => Math.min(i + 1, test.questions.length - 1))}>
              Next
            </button>
          </div>
          <button className="mt-4 btn btn-danger w-full" onClick={() => handleSubmit("submit_button")}>
            Submit Test
          </button>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold">{test.title}</h2>
          <p className="text-lg">{test.description}</p>
          <button className="btn btn-primary mt-4" onClick={startTest}>
            Start Test
          </button>
        </div>
      )}
    </div>
  );
};

export default OrgTestPage;
