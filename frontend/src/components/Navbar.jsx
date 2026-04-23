import { useNavigate, NavLink } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  let user = null;

  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser);
    }
  } catch {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={styles.navbar}>
      {/* LEFT */}
      <div style={styles.left}>
        <h2 style={styles.logo} onClick={() => navigate("/")}>
          🚀 CareerAI
        </h2>
      </div>

      {/* HAMBURGER BUTTON */}
      <button
  className="menu-btn"
  style={styles.menuBtn}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      {/* RIGHT MENU */}
      <div
  style={{
    ...styles.right,
    right: {
  display: window.innerWidth <= 768 ? "none" : "flex",
  alignItems: "center",
  gap: "10px",
},
    ...(menuOpen ? styles.mobileMenu : {}),
  }}
>
        <span style={styles.username}>
          👤 {user?.name || "User"}
        </span>

        <NavLink
          to="/"
          style={({ isActive }) => ({
            ...styles.navButton,
            background: isActive ? "#6366f1" : "#3b82f6",
          })}
          onClick={() => setMenuOpen(false)}
        >
          Home
        </NavLink>

        <NavLink
          to="/profile"
          style={({ isActive }) => ({
            ...styles.navButton,
            background: isActive ? "#6366f1" : "#3b82f6",
          })}
          onClick={() => setMenuOpen(false)}
        >
          Profile
        </NavLink>

        <NavLink
          to="/history"
          style={({ isActive }) => ({
            ...styles.navButton,
            background: isActive ? "#6366f1" : "#3b82f6",
          })}
          onClick={() => setMenuOpen(false)}
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
    padding: "12px 16px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    marginBottom: "20px",
    position: "relative",
  },

  left: {
    display: "flex",
    alignItems: "center",
  },

  logo: {
    margin: 0,
    cursor: "pointer",
    fontSize: "18px",
  },

  menuBtn: {
    fontSize: "22px",
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
    display: "none", // hidden on desktop
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  username: {
    fontWeight: "bold",
    fontSize: "14px",
  },

  navButton: {
    padding: "6px 10px",
    borderRadius: "8px",
    color: "white",
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

  // 🔥 MOBILE DROPDOWN
  mobileMenu: {
  position: "absolute",
  display: "flex",
  top: "60px",
  right: "10px",
  flexDirection: "column",
  alignItems: "flex-start",
  background: "#1e293b",
  padding: "15px",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
  zIndex: 999,
  width: "180px", // 👈 ADD THIS
},
};

export default Navbar;