function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>

      <div className="container" style={{ textAlign: "center" }}>
        <h1 style={{ marginBottom: "20px" }}>👤 Profile</h1>

        <div
          className="card"
          style={{
            maxWidth: "400px",
            margin: "20px auto",
            padding: "20px",
            borderRadius: "12px",
            background: "#1e293b",
            color: "white"
          }}
        >
          <p><strong>Name:</strong> {user?.name || "N/A"}</p>
          <p><strong>Email:</strong> {user?.email || "N/A"}</p>
        </div>
      </div>
    </>
  );
}

export default Profile;