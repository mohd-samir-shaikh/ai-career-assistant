import { useState, useEffect } from "react";
import Upload from "../components/Upload";
import ChatBox from "../components/ChatBox";
import TypingText from "../components/TypingText";

function Home() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (res.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
        return;
      }

      const data = await res.json();
      setResult(data.result);

    } catch (err) {
      console.error(err);
      setError("Error uploading file");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 PROGRESS BAR ANIMATION
  useEffect(() => {
    const bars = document.querySelectorAll(".progress-fill");

    bars.forEach((bar) => {
      const width = bar.style.width;
      bar.style.width = "0%";

      setTimeout(() => {
        bar.style.width = width;
      }, 200);
    });
  }, [result]);

  return (
    <div className="container">

      <h1 className="main-title">
        AI Career Assistant 🚀
      </h1>

      {error && (
        <p style={{ color: "red", textAlign: "center" }}>{error}</p>
      )}

      <Upload
        setFile={setFile}
        handleUpload={handleUpload}
        loading={loading}
      />

      {/* 🔥 LOADING SKELETON */}
      {loading && (
        <div className="skeleton-container">
          <div className="skeleton skeleton-title"></div>
          <div className="skeleton skeleton-card"></div>
          <div className="skeleton skeleton-card"></div>
        </div>
      )}

      {!result && !loading && (
        <p className="empty-text">
          Upload your resume to get AI insights 🚀
        </p>
      )}

      {result && (
        <>
          <div className="score">
            🎯 Resume Score: {result.score}/100
          </div>

          <div className="card-grid">

            <div className="card">
              <h3>✅ Skills</h3>
              {result.skills?.map((s, i) => (
                <TypingText text={s} key={i} />
              ))}
            </div>

            <div className="card">
              <h3>❌ Missing Skills</h3>
              {result.missingSkills?.map((s, i) => (
                <TypingText text={s} key={i} />
              ))}
            </div>

            <div className="card">
              <h3>💡 Suggestions</h3>
              {result.suggestions?.map((s, i) => (
                <TypingText text={s} key={i} />
              ))}
            </div>

            <div className="card">
              <h3>🚀 Career Roles</h3>
              {result.careerRoles?.map((s, i) => (
                <TypingText text={s} key={i} />
              ))}
            </div>

          </div>

          {/* 🔥 JOB MATCH */}
          {result.jobMatches && (
            <div className="job-section">
              <h2>💼 Job Match Analysis</h2>

              {result.jobMatches.map((job, i) => (
                <div key={i} className="job-card">

                  <div className="job-header">
                    <strong>{job.role}</strong>
                    <span>{job.match}%</span>
                  </div>

                  {/* 🔥 NEW ANIMATED BAR */}
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${job.match}%` }}
                    ></div>
                  </div>

                  <p className="missing">
                    Missing: {job.missing.join(", ")}
                  </p>

                </div>
              ))}
            </div>
          )}

          {result?.resumeFile && (
            <a
              href={`${import.meta.env.VITE_API_URL}/uploads/${result.resumeFile}`}
              target="_blank"
              rel="noreferrer"
            >
              <div className="download-btn">
                <button>Download Resume</button>
              </div>
            </a>
          )}

          <ChatBox />
        </>
      )}

    </div>
  );
}

export default Home;