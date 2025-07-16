import axios from 'axios';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';

export function Signup() {
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
    }),
    onSubmit: async (values, { setSubmitting, resetForm, setStatus }) => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/signup/', values);
        setStatus({ success: response.data.message });
        resetForm();
      } catch (error) {
        if (error.response && error.response.data) {
          setStatus({ error: error.response.data });
        } else {
          setStatus({ error: { general: 'Something went wrong' } });
        }
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="border border-2 p-5 w-25 w-md-50 w-lg-25 bg-white shadow-lg rounded">
        <h2 className="text-center text-primary mb-4">
          <i className="bi bi-person-fill"></i> Signup
        </h2>

        {/* Display Status Messages */}
        {formik.status?.success && (
          <div className="alert alert-success">{formik.status.success}</div>
        )}
        {formik.status?.error?.general && (
          <div className="alert alert-danger">{formik.status.error.general}</div>
        )}

        <form onSubmit={formik.handleSubmit}>
          {/* Username Field */}
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-control"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your username"
            />
            {formik.touched.username && formik.errors.username && (
              <div className="text-danger">{formik.errors.username}</div>
            )}
            {formik.status?.error?.username && (
              <div className="text-danger">{formik.status.error.username[0]}</div>
            )}
          </div>

          {/* Email Field */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your email"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-danger">{formik.errors.email}</div>
            )}
            {formik.status?.error?.email && (
              <div className="text-danger">{formik.status.error.email[0]}</div>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your password"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-danger">{formik.errors.password}</div>
            )}
            {formik.status?.error?.password && (
              <div className="text-danger">{formik.status.error.password[0]}</div>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-100 py-2" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Creating Account...' : 'Signup'}
          </button>

          {/* Navigation Links */}
          <div className="text-center mt-3">
            <Link to="/login" className="text-primary">
              Back to login page
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
