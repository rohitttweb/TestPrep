import { useState } from "react";
const API_BASE_URL = process.env.API_URL;

export default function CreateTest() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: "" }
  ]);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (setter) => (e) => {
    setError("");
    setter(e.target.value);
  };

  const handleQuestionChange = (index, value) => {
    setError("");
    setQuestions(prev => {
      const updated = [...prev];
      updated[index].question = value;
      return updated;
    });
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    setError("");
    setQuestions(prev => {
      const updated = [...prev];
      updated[qIndex].options[optIndex] = value;
      return updated;
    });
  };

  const handleCorrectAnswerChange = (qIndex, value) => {
    setError("");
    setQuestions(prev => {
      const updated = [...prev];
      updated[qIndex].correctAnswer = value;
      return updated;
    });
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswer: "" }]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    } else {
      setError("At least one question is required.");
    }
  };

  const validateFields = () => {
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        setError(`Question ${i + 1} cannot be empty.`);
        return false;
      }
      if (q.options.some(opt => !opt.trim())) {
        setError(`All options for Question ${i + 1} must be filled.`);
        return false;
      }
      if (!q.correctAnswer.trim()) {
        setError(`Select a correct answer for Question ${i + 1}.`);
        return false;
      }
    }

    setError("");
    return true;
  };

  const handlePreview = () => {
    if (validateFields()) {
      setShowPreview(true);
    }
  };

  const getUserToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("UserToken="))
      ?.split("=")[1] || null;
  };

  const createTest = async () => {
    setShowPreview(false);
    const userToken = getUserToken();
    if (!userToken) {
      setError("Authentication required. Please log in.");
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/org/test/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({ title, description, questions }),
    });

    const data = await response.json();
    if (data.error) {
      setError(data.error);
    }
    window.location.reload();
  };

  return (
    <div className="p-4 mt-4 max-w-6xl mx-auto space-y-4  rounded-lg">
      <h2 className="text-2xl font-bold">Create a Test</h2>
      <input
        type="text"
        placeholder="Test Title"
        value={title}
        onChange={handleInputChange(setTitle)}
        className="input input-bordered w-full"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={handleInputChange(setDescription)}
        className="textarea textarea-bordered w-full"
      />

      <h3 className="text-lg font-semibold">Questions</h3>
      {questions.map((q, i) => (
        <div key={i} className="border p-4 rounded-lg bg-white mb-3 relative">
          <button
            onClick={() => removeQuestion(i)}
            className="btn btn-sm btn-circle absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600"
          >✕</button>
          <textarea
            placeholder={`Question ${i + 1}`}
            value={q.question}
            onChange={(e) => handleQuestionChange(i, e.target.value)}
            className="textarea textarea-bordered w-full mb-2 h-24 resize-none"
          ></textarea>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {q.options.map((opt, j) => (
              <input
                key={j}
                type="text"
                placeholder={`Option ${String.fromCharCode(65 + j)}`}
                value={opt}
                onChange={(e) => handleOptionChange(i, j, e.target.value)}
                className="input input-bordered w-full"
              />
            ))}
          </div>
          <select
            value={q.correctAnswer}
            onChange={(e) => handleCorrectAnswerChange(i, e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="" disabled>Select Correct Answer</option>
            {q.options.map((opt, j) => (
              <option key={j} value={opt}>{`Option ${String.fromCharCode(65 + j)}`}</option>
            ))}
          </select>
        </div>
      ))}
      <button onClick={addQuestion} className="btn btn-outline">+ Add Question</button>
      {error && <div className="alert alert-error">{error}</div>}
      <button onClick={handlePreview} className="btn btn-primary w-full">Preview Test</button>
      {showPreview && (
  <dialog className="modal modal-open">
    <div className="modal-box max-w-4xl w-full relative">
      {/* Close Button */}
      <button
        onClick={() => setShowPreview(false)}
        className="btn btn-sm btn-circle absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white"
      >
        ✕
      </button>

      {/* Header */}
      <h2 className="text-2xl font-bold text-center mb-2">Test Preview</h2>
      <div className="border-b pb-2 mb-4 text-center">
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-gray-600">{description}</p>
      </div>

      {/* Scrollable Content */}
      <div className="max-h-[60vh] overflow-y-auto px-2">
        {questions.map((q, i) => (
          <div key={i} className="card bg-base-100 shadow-md p-4 mb-3">
            <p className="font-semibold text-lg">{i + 1}. {q.question}</p>
            <ul className="mt-2 space-y-1">
              {q.options.map((opt, j) => (
                <li
                  key={j}
                  className={`p-2 rounded-md ${opt === q.correctAnswer ? "bg-green-100 border-l-4 border-green-500" : "bg-white"}`}
                >
                  {String.fromCharCode(65 + j)}. {opt}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-sm font-semibold text-green-600">
              Correct Answer: {q.correctAnswer}
            </p>
          </div>
        ))}
      </div>

      {/* Footer Buttons */}
      <div className="flex flex-col sm:flex-row justify-between mt-6 space-y-2 sm:space-y-0">
        <button
          onClick={() => setShowPreview(false)}
          className="btn btn-outline flex-1"
        >
          Go Back
        </button>
        <button
          onClick={createTest}
          className="btn btn-primary flex-1"
        >
          Confirm & Create
        </button>
      </div>
    </div>
  </dialog>
)}



    </div>
  );
}