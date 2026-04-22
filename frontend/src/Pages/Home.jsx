import { useState } from "react";
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
      setResult(null); // 🔥 ADD THIS BEFORE API CALL

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

  return (
    <div className="container">

      <h1 style={{
        fontSize: "40px",
        marginBottom: "20px",
        textAlign: "center",
        background: "linear-gradient(90deg,#3b82f6,#6366f1)",
        WebkitBackgroundClip: "text",
        color: "transparent"
      }}>
        AI Career Assistant 🚀
      </h1>

      {/* ❌ ERROR */}
      {error && (
        <p style={{ color: "red", textAlign: "center" }}>{error}</p>
      )}

      {/* ✅ UPLOAD */}
      <Upload
        setFile={setFile}
        handleUpload={handleUpload}
        loading={loading}
      />

      {/* 💤 EMPTY */}
      {!result && !loading && (
        <p style={{ textAlign: "center", opacity: 0.6, marginTop: "20px" }}>
          Upload your resume to get AI insights 🚀
        </p>
      )}

      {/* ✅ RESULT */}
      {result && (
        <>
          {/* 🎯 SCORE */}
          {result?.score !== undefined && (
            <div style={{
              textAlign: "center",
              marginBottom: "20px",
              fontSize: "24px",
              fontWeight: "bold"
            }}>
              🎯 Resume Score: {result.score}/100
            </div>
          )}

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

          {/* 🔥 JOB MATCH (NEW FEATURE) */}
          {result.jobMatches && (
            <div style={{ marginTop: "40px" }}>
              <h2 style={{ textAlign: "center" }}>
                💼 Job Match Analysis
              </h2>

              {result.jobMatches.map((job, i) => (
                <div key={i} style={styles.jobCard}>

                  <div style={styles.jobHeader}>
                    <strong>{job.role}</strong>
                    <span>{job.match}%</span>
                  </div>

                  {/* PROGRESS BAR */}
                  <div style={styles.progressBar}>
                    <div
                      style={{
                        ...styles.progressFill,
                        width: `${job.match}%`,
                        background:
                          job.match > 80
                            ? "#22c55e"
                            : job.match > 50
                            ? "#facc15"
                            : "#ef4444",
                      }}
                    />
                  </div>

                  <p style={styles.missing}>
                    Missing: {job.missing.join(", ")}
                  </p>

                </div>
              ))}
            </div>
          )}

          {/* 📄 DOWNLOAD */}
          {result?.resumeFile && (
            <a
              href={`${import.meta.env.VITE_API_URL}/uploads/${result.resumeFile}`}
              target="_blank"
              rel="noreferrer"
            >
              <button style={{ marginTop: "20px" }}>
                📄 Download Resume
              </button>
            </a>
          )}

          {/* 💬 CHAT */}
          <div style={{ marginTop: "40px" }}>
            <ChatBox />
          </div>
        </>
      )}

    </div>
  );
}

/* 🔥 NEW STYLES (NO CLASS CHANGE) */
const styles = {
  jobCard: {
    margin: "15px auto",
    padding: "15px",
    background: "#1e293b",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "500px",
  },

  jobHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
  },

  progressBar: {
    height: "10px",
    background: "#334155",
    borderRadius: "5px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: "5px",
  },

  missing: {
    marginTop: "8px",
    fontSize: "12px",
    color: "#cbd5f5",
  },
};

export default Home;