import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const email = localStorage.getItem("reset_email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/verify-otp/", { email, otp });
      setMessage("OTP verified. Proceed to reset password.");
      navigate("/reset-password");
    } catch (err) {
      setMessage("Invalid OTP.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: '#f7f7f7' }}>
      <form className="border border-2 p-5 w-25 bg-white shadow-lg rounded" onSubmit={handleSubmit}>
        <h2 className="text-center mb-4 text-primary">Verify OTP</h2>

        <div className="mb-3">
          <label htmlFor="otp" className="form-label">Enter OTP</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter the OTP sent to email"
            className="form-control"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100 py-2">Verify</button>
        {message && <p className="text-center mt-3 text-muted">{message}</p>}
      </form>
    </div>
  );
}