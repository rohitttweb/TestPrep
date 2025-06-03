import { House } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL

const getUserToken = () => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("UserToken="))
    ?.split("=")[1] || null;
};

export default function TestAttempts() {
  const { testId } = useParams();
  const [testTitle, setTestTitle] = useState("Loading...");
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const attemptsPerPage = 8;

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/org/test/${testId}`, {
          headers: { Authorization: `Bearer ${getUserToken()}` },
        });
        const data = await response.json();
        if (response.ok) {
          setTestTitle(data.title || "Untitled Test");
        } else {
          setTestTitle("Test Not Found");
        }
      } catch {
        setTestTitle("Test Not Found");
      }
    };

    const fetchAttempts = async () => {
      const userToken = getUserToken();
      if (!userToken) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/org/test/${testId}/attempts`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        const data = await response.json();
        if (response.ok) {
          setAttempts(data.attempts.sort((a, b) => new Date(b.attemptedAt) - new Date(a.attemptedAt)));
        } else {
          setError(response.status === 403 ? "You are not the owner of this test." : data.error || "Failed to fetch attempts.");
        }
      } catch {
        setError("An error occurred while fetching attempts.");
      } finally {
        setLoading(false);
      }
    };

    fetchTestDetails();
    fetchAttempts();
  }, [testId]);

  const lastIndex = currentPage * attemptsPerPage;
  const firstIndex = lastIndex - attemptsPerPage;
  const currentAttempts = attempts.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(attempts.length / attemptsPerPage);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="absolute top-5 left-5">
                <a href="/dashboard" className="text-gray-600 hover:text-black">
                    <House />
                </a>
            </div>
      <h2 className="text-xl font-semibold mb-4">Test Attempts</h2>
      <h1 className="text-sm font-bold mb-2">{`${testTitle.slice(0, 100)}  .....`}</h1>

      {loading && <div className="text-center text-lg">Loading...</div>}
      {error && <div className="alert alert-error"><span>{error}</span></div>}

      {!loading && !error && attempts.length === 0 && (
        <div className="alert alert-info">No attempts found for this test.</div>
      )}

      {attempts.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Submit Event</th>
                <th>Attempt Date</th>
                <th>Score</th>
                <th>View Details</th>
              </tr>
            </thead>
            <tbody>
              {currentAttempts.map((attempt, index) => (
                <tr key={attempt._id}>
                  <td>{firstIndex + index + 1}</td>
                  <td>{attempt.userId?.name || "Unknown User"}</td>
                  <td className={`font-bold text-${attempt.submittedEvent === "window_blur" ? "red" : attempt.submittedEvent === "submit_button" ? "green" : "orange"}-600`}>
                    {attempt.submittedEvent}
                  </td>
                  <td>{new Date(attempt.attemptedAt).toLocaleString()}</td>
                  <td>{attempt.score} / {attempt.totalScore}</td>
                  <td>
                    <button className="btn btn-sm btn-primary" onClick={() => setSelectedAttempt(attempt)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-4 space-x-2">
            <button className="btn btn-sm btn-secondary" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
            <span className="font-semibold">Page {currentPage} of {totalPages}</span>
            <button className="btn btn-sm btn-secondary" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
          </div>
        </div>
      )}

      {/* Attempt Details Modal */}
      {selectedAttempt && <AttemptModal attempt={selectedAttempt} onClose={() => setSelectedAttempt(null)} />}
    </div>
  );
}

// Attempt Details Modal with Pagination
function AttemptModal({ attempt, onClose }) {
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 3;

  const lastIndex = currentPage * questionsPerPage;
  const firstIndex = lastIndex - questionsPerPage;
  const currentQuestions = attempt.questions.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(attempt.questions.length / questionsPerPage);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full shadow-lg">
        <h3 className="text-2xl font-bold mb-4">Attempt Details</h3>
        <p className="text-lg font-semibold mb-2">User: {attempt.userId?.name || "Unknown User"}</p>
        <p className="text-lg font-semibold mb-2">Score: {attempt.score} / {attempt.totalScore}</p>
        <p className={`text-lg font-semibold mb-2 text-${attempt.submittedEvent === "window_blur" ? "red" : attempt.submittedEvent === "submit_button" ? "green" : "orange"}-600`}>
          Submit Event: {attempt.submittedEvent}
        </p>

        <div className="max-h-96 overflow-y-auto p-2 border rounded">
          {currentQuestions.map((q, idx) => (
            <div key={q.questionId} className="mb-4 p-3 border-b">
              <p className="font-semibold">{firstIndex + idx + 1}. {q.question}</p>
              <div className="mt-2">
                {q.options.map((option, optionIdx) => {
                  let bgColor = "text-gray-700";
                  if (option === q.userselected) {
                    bgColor = q.userselected === q.correctAnswer
                      ? "bg-green-100 border border-green-500 text-green-600 font-bold"
                      : "bg-red-100 border border-red-500 text-red-600 font-bold";
                  }
                  return <div key={optionIdx} className={`p-2 mb-2 rounded-md border ${bgColor}`}>{option}</div>;
                })}
              </div>
              <p className="mt-2 text-sm text-gray-700">✅ Correct Answer: <span className="font-bold text-green-600">{q.correctAnswer}</span></p>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center mt-4 space-x-2">
          <button className="btn btn-sm btn-secondary" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
          <span className="font-semibold">Page {currentPage} of {totalPages}</span>
          <button className="btn btn-sm btn-secondary" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
        </div>

        <button className="btn btn-secondary mt-4 w-full" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
