import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from 'yup';
import axios from "axios";

export function PasswordChange() {
  const accessToken = localStorage.getItem("access");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      old_password: '',
      new_password: '',
      confirm_password: ''
    },
    validationSchema: yup.object({
      old_password: yup.string().required("Old password is required"),
      new_password: yup.string().min(6, "New password must be at least 6 characters").required("New password is required"),
      confirm_password: yup.string()
        .oneOf([yup.ref('new_password'), null], "Passwords must match")
        .required("Please confirm your new password")
    }),
    onSubmit: (values, { resetForm, setSubmitting }) => {
      axios.post("http://127.0.0.1:8000/change-password/", {
        old_password: values.old_password,
        new_password: values.new_password
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        alert(response.data.message || "Password changed successfully");
        resetForm();
        navigate("/dashboard"); // redirect to dashboard
      })
      .catch(error => {
        alert(error.response?.data?.error || "Failed to change password");
      })
      .finally(() => setSubmitting(false));
    }
  });

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
      <div className="border border-2 p-5 w-25 w-md-50 w-lg-25 bg-white shadow-lg rounded">
        <h2 className="text-center text-primary mb-4">Change Password</h2>
        
        <form onSubmit={formik.handleSubmit}>
          {/* Old Password */}
          <div className="mb-3">
            <label htmlFor="old_password" className="form-label">Old Password</label>
            <input
              type="password"
              id="old_password"
              name="old_password"
              className={`form-control ${formik.touched.old_password && formik.errors.old_password ? 'is-invalid' : ''}`}
              placeholder="Enter your old password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.old_password}
            />
            {formik.touched.old_password && formik.errors.old_password && (
              <div className="invalid-feedback">{formik.errors.old_password}</div>
            )}
          </div>

          {/* New Password */}
          <div className="mb-3">
            <label htmlFor="new_password" className="form-label">New Password</label>
            <input
              type="password"
              id="new_password"
              name="new_password"
              className={`form-control ${formik.touched.new_password && formik.errors.new_password ? 'is-invalid' : ''}`}
              placeholder="Enter your new password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.new_password}
            />
            {formik.touched.new_password && formik.errors.new_password && (
              <div className="invalid-feedback">{formik.errors.new_password}</div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label htmlFor="confirm_password" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              className={`form-control ${formik.touched.confirm_password && formik.errors.confirm_password ? 'is-invalid' : ''}`}
              placeholder="Confirm your new password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirm_password}
            />
            {formik.touched.confirm_password && formik.errors.confirm_password && (
              <div className="invalid-feedback">{formik.errors.confirm_password}</div>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-100 py-2 mb-3" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? "Updating..." : "Update"}
          </button>

          {/* Link Back */}
          <div className="text-center">
            <Link to="/dashboard" className="text-decoration-none py-2">Back to Dashboard</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
