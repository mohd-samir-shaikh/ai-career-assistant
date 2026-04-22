import { useNavigate, NavLink } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  let user = null;

  try {
    const storedUser = localStorage.getItem("user");

    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Invalid user data:", error);
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={styles.navbar}>
      {/* LOGO */}
      <h2 style={styles.logo} onClick={() => navigate("/")}>
        🚀 CareerAI
      </h2>

      <div style={styles.right}>
        <span style={styles.username}>
          👤 {user?.name || "User"}
        </span>

        <div style={styles.buttonGroup}>
          <NavLink
            to="/"
            style={({ isActive }) => ({
              ...styles.navButton,
              background: isActive ? "#6366f1" : "#3b82f6",
            })}
          >
            Home
          </NavLink>

          <NavLink
            to="/profile"
            style={({ isActive }) => ({
              ...styles.navButton,
              background: isActive ? "#6366f1" : "#3b82f6",
            })}
          >
            Profile
          </NavLink>

          <NavLink
            to="/history"
            style={({ isActive }) => ({
              ...styles.navButton,
              background: isActive ? "#6366f1" : "#3b82f6",
            })}
          >
            History
          </NavLink>

          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    marginBottom: "20px",
    flexWrap: "wrap", // 🔥 IMPORTANT FOR MOBILE
    gap: "10px",
  },

  logo: {
    margin: 0,
    cursor: "pointer",
    fontSize: "18px",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },

  username: {
    fontWeight: "bold",
    fontSize: "14px",
  },

  buttonGroup: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap", // 🔥 FIX WRAPPING ISSUE
  },

  navButton: {
    padding: "6px 10px",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    textDecoration: "none",
    fontSize: "13px",
    whiteSpace: "nowrap",
  },

  logoutButton: {
    padding: "6px 10px",
    background: "#ef4444",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    fontSize: "13px",
  },
};

export default Navbar;