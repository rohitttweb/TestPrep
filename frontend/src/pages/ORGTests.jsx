import { useEffect, useState } from "react";

const API_BASE_URL = process.env.API_URL; // Load from .env

const getUserToken = () => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("UserToken="))
    ?.split("=")[1] || null;
};

export default function ORGTests() {


  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTests = async () => {
      const userToken = getUserToken();
      if (!userToken) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/org/tests`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        const data = await response.json();
        console.log(data)
        if (response.ok) {
          setTests(data.tests);
        } else {
          setError(data.error || "Failed to fetch tests.");
        }
      } catch (err) {
        setError("An error occurred while fetching tests.");
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Your Created Tests</h2>

      {loading && <div className="text-center text-lg">Loading...</div>}
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && tests.length === 0 && (
        <div className="alert alert-info">You have not created any tests yet.</div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {tests.map((test) => (
          <div key={test._id} className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title">{`${test.title.slice(0, 30)}...`}</h3>
              <p className="text-sm text-gray-500">{ `${test.description.slice(0, 300)}...`}</p>
              <p className="text-sm">Questions: {test.questions.length}</p>
              <div className="flex items-center gap-2 mt-2">
                <a href={`/test/${test._id}`} className="text-blue-500 underline text-sm truncate max-w-[150px]">
                  {`${window.location.origin}/test/${test._id.slice(0, 6)}...`}
                </a>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/test/${test._id}`)}
                >
                  Copy
                </button>
              </div>

              <a
                href={`/test/${test._id}/attempts`}
                className="btn btn-primary mt-2"
              >
                View Test
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
