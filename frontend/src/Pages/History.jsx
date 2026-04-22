import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
function History() {
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/ai/my-results`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        setResults(data);

      } catch (err) {
        console.error(err);
      }
    };

    fetchResults();
  }, []);

  return (
    <>

      <div className="container">
        <h1 style={{ textAlign: "center" }}>📄 Resume History</h1>

        {results.length === 0 ? (
          <p style={{ textAlign: "center" }}>
            No history found
          </p>
        ) : (
          <div style={{ marginTop: "20px" }}>
            {results.map((item, index) => (
              <div
                key={index}
                className="card"
                style={{ marginBottom: "15px" }}
                onClick={() =>
                    navigate("/", { state: { selectedResult: item } })
                    }
              >
                <h3>Resume #{index + 1}</h3>

                <p>
                  Uploaded on:{" "}
                  {new Date(item.createdAt).toLocaleString()}
                </p>

                <p>Skills: {item.skills?.length}</p>

                {/* ✅ DOWNLOAD BUTTON */}
                {item.resumeFile && (
                  <a
                    href={`${import.meta.env.VITE_API_URL}/uploads/${item.resumeFile}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="download-btn">
  <button>Download Resume</button>
</div>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default History;