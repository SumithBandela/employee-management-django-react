import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/forgot-password/", { email });
      setMessage("OTP sent to your email.");
      localStorage.setItem("reset_email", email);
      navigate("/verify-otp");
    } catch (err) {
      setMessage("Failed to send OTP. Try again.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: '#f7f7f7' }}>
      <form className="border border-2 p-5 w-25 bg-white shadow-lg rounded" onSubmit={handleSubmit}>
        <h2 className="text-center mb-4 text-primary">Password Recovery</h2>
        <p className="text-center text-muted mb-4">Enter your email and we'll send you an OTP to reset your password.</p>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="form-control"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100 py-2 mt-3">Send OTP</button>

        {message && <p className="text-center mt-3 text-muted">{message}</p>}

        <div className="text-center mt-3">
          <p className="text-muted">
            Remembered? <a href="/login" className="text-primary">Back to Login</a>
          </p>
        </div>
      </form>
    </div>
  );
}
