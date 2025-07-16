import { Link } from "react-router-dom";

export function PasswordChange() {
  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
      <div className="border border-2 p-5 w-25 w-md-50 w-lg-25 bg-white shadow-lg rounded">
        <h2 className="text-center text-primary mb-4">Change Password</h2>
        
        <form>
          {/* Old Password */}
          <div className="mb-3">
            <label htmlFor="old_password" className="form-label">Old Password</label>
            <input
              type="password"
              id="old_password"
              name="old_password"
              className="form-control"
              placeholder="Enter your old password"
            />
          </div>

          {/* New Password */}
          <div className="mb-3">
            <label htmlFor="new_password" className="form-label">New Password</label>
            <input
              type="password"
              id="new_password"
              name="new_password"
              className="form-control"
              placeholder="Enter your new password"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label htmlFor="confirm_password" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              className="form-control"
              placeholder="Confirm your new password"
            />
          </div>

          {/* Action Buttons */}
          <button type="submit" className="btn btn-primary w-100 py-2 mb-3">Update</button>
         <div className="text-center">
             <Link to="/dashboard" className=" py-2">Back to Dashboard</Link>
         </div>
        </form>
      </div>
    </div>
  );
}
