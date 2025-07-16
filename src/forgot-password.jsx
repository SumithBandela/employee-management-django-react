export function ForgotPassword() {
  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: '#f7f7f7' }}>
      <form className="border border-2 p-5 w-25 w-md-50 w-lg-25 bg-white shadow-lg rounded">
        <h2 className="text-center mb-4 text-primary">Password Recovery</h2>
        <p className="text-center text-muted mb-4">Enter your email address and we will send you a link to reset your password.</p>
        
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className="form-control"
            required
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        
        <button type="submit" className="btn btn-primary w-100 py-2 mt-3">
          Send Reset Link
        </button>

        <div className="text-center mt-3">
          <p className="text-muted">
            Remembered your password? <a href="/login" className="text-primary">Go back to login</a>
          </p>
        </div>
      </form>
    </div>
  );
}
