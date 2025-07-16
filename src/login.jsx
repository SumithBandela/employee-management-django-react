import axios from "axios";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";

export function Login() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: yup.object({
      username: yup.string().required("Username is required"),
      password: yup.string().required("Password is required"),
    }),
    onSubmit: async (formData, { setSubmitting, setStatus }) => {
      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/api/login/`,
          formData
        );

        // Storing token in localStorage
        localStorage.setItem("access", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);

        setStatus({ success: "Login successful!" });
        navigate("/dashboard");
      } catch (error) {
        setStatus({
          error: "Invalid username or password",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div
      className="container d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <form
        className="border border-2 w-md-50 w-lg-25 p-4 rounded-lg shadow-lg bg-white" style={{width:'500px'}}
        onSubmit={formik.handleSubmit}
      >
        <h2 className="text-center text-primary mb-4">
          <i className="bi bi-person-fill"></i> Admin Login
        </h2>

        {/* Display Status Messages */}
        {formik.status?.success && (
          <div className="alert alert-success">{formik.status.success}</div>
        )}
        {formik.status?.error && (
          <div className="alert alert-danger">{formik.status.error}</div>
        )}

        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            className="form-control"
            onChange={formik.handleChange}
            value={formik.values.username}
            aria-describedby="usernameHelp"
          />
          <small id="usernameHelp" className="form-text text-danger">
            {formik.errors.username && formik.touched.username && formik.errors.username}
          </small>
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="form-control"
            onChange={formik.handleChange}
            value={formik.values.password}
            aria-describedby="passwordHelp"
          />
          <small id="passwordHelp" className="form-text text-danger">
            {formik.errors.password && formik.touched.password && formik.errors.password}
          </small>
        </div>

        <button
          className="btn btn-primary w-100 py-2"
          type="submit"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Logging in..." : "Login"}
        </button>

        <div className="text-center mt-3">
          <Link className="d-block mb-2" to="/forgot-password">
            Forgotten your password?
          </Link>
          <span>
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary">
              Sign up
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}
