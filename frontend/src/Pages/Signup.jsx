import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Signup() {
  const [name, setName] = useState(""); // ✅ NEW
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSignup = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,      // ✅ REQUIRED
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success("Signup successful 🎉");
navigate("/login");

    } catch (err) {
      console.error(err);
      toast.error("Signup failed ❌");
    }
  };

  return (
  <div className="auth-container">
    <div className="auth-card">
      <h2 style={{ marginBottom: "20px" }}>Signup</h2>

      <input
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleSignup}>Signup</button>

      <p>
  Already have an account?{" "}
  <Link to="/login" style={{ color: "#3b82f6" }}>
    Login
  </Link>
</p>
    </div>
  </div>
);
}

export default Signup;