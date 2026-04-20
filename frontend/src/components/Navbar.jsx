import { useNavigate, NavLink } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  // ✅ SAFE USER PARSE (KEEP SAME)
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
      {/* LOGO → also clickable HOME */}
      <h2 style={styles.logo} onClick={() => navigate("/")}>
        🚀 CareerAI
      </h2>

      <div style={styles.right}>
        <span style={styles.username}>
          👤 {user?.name || "User"}
        </span>

        {/* ✅ HOME BUTTON */}
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
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 20px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    marginBottom: "20px",
  },

  logo: {
    margin: 0,
    cursor: "pointer", // 👈 clickable
  },

  right: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
  },

  username: {
    fontWeight: "bold",
  },

  navButton: {
    padding: "6px 12px",
    border: "none",
    borderRadius: "5px",
    color: "white",
    cursor: "pointer",
    textDecoration: "none",
  },

  logoutButton: {
    padding: "6px 12px",
    background: "#ef4444",
    border: "none",
    borderRadius: "5px",
    color: "white",
    cursor: "pointer",
  },
};

export default Navbar;