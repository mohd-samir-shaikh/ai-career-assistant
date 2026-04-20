function Upload({ setFile, handleUpload, loading }) {
return (
  <div className="upload-container">
    <input type="file" onChange={(e) => setFile(e.target.files[0])} />
    <button onClick={handleUpload}>
      {loading ? "Analyzing..." : "Upload Resume"}
    </button>
  </div>
);
}

export default Upload;