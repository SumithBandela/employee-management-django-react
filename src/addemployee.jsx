import axios from "axios";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";

export function AddEmployee() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      salary: '',
      designation: '',
      joined_date: '',
      photo: null   
    },
    validationSchema: yup.object({
      firstname: yup.string().required('Firstname is required'),
      lastname: yup.string().required('Lastname is required'),
      email: yup.string().email('Invalid email').required('Email is required'),
      phone: yup.string().matches(/^\d{10}$/, "Phone number must be 10 digits").required("Phone number is required"),
      salary: yup.string().required('Salary is required'),
      designation: yup.string().required('Designation is required'),
      joined_date: yup.date().required('Joining date is required'),
    }),onSubmit: async (formData, { setSubmitting, resetForm }) => {
  setSubmitting(true); 
  try {
    
    if (!formData.photo) {
      alert("Please select a photo.");
      setSubmitting(false);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Image = reader.result;

        const payload = {
          ...formData,
          photo: base64Image, 
        };

        const response = await axios.post('http://127.0.0.1:8000/api/employees/', payload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("access")}`, 
          },
        });

        console.log('Employee added:', response.data);
        navigate('/dashboard');
        resetForm();
        
      } catch (error) {
        console.error('Error adding employee:', error.response?.data || error.message);
      } finally {
        setSubmitting(false);
      }
    };

    reader.readAsDataURL(formData.photo); // ✅ Start reading image as base64

  } catch (outerError) {
    console.error('Unexpected error:', outerError);
    setSubmitting(false);
  }
}

  });

  return (
     <div className="d-flex justify-content-center align-items-center mt-5" style={{ minHeight: "100vh" }}>
      <form
        className="w-50 w-md-75 w-lg-50 border border-2 p-4 bg-white shadow-lg rounded"
        onSubmit={formik.handleSubmit}
        encType="multipart/form-data"
      >
        <h2 className="text-center text-primary mb-4">Add Employee</h2>

        {/* First Name */}
        <div className="mb-3">
          <label htmlFor="firstname" className="form-label">Firstname</label>
          <input
            type="text"
            name="firstname"
            className="form-control"
            onChange={formik.handleChange}
            value={formik.values.firstname}
            id="firstname"
          />
          {formik.touched.firstname && formik.errors.firstname && (
            <div className="text-danger">{formik.errors.firstname}</div>
          )}
        </div>

        {/* Last Name */}
        <div className="mb-3">
          <label htmlFor="lastname" className="form-label">Lastname</label>
          <input
            type="text"
            name="lastname"
            className="form-control"
            onChange={formik.handleChange}
            value={formik.values.lastname}
            id="lastname"
          />
          {formik.touched.lastname && formik.errors.lastname && (
            <div className="text-danger">{formik.errors.lastname}</div>
          )}
        </div>

        {/* Email */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="text"
            name="email"
            className="form-control"
            onChange={formik.handleChange}
            value={formik.values.email}
            id="email"
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-danger">{formik.errors.email}</div>
          )}
        </div>

        {/* Phone */}
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Phone</label>
          <input
            type="text"
            name="phone"
            className="form-control"
            onChange={formik.handleChange}
            value={formik.values.phone}
            id="phone"
          />
          {formik.touched.phone && formik.errors.phone && (
            <div className="text-danger">{formik.errors.phone}</div>
          )}
        </div>

        {/* Salary */}
        <div className="mb-3">
          <label htmlFor="salary" className="form-label">Salary</label>
          <input
            type="text"
            name="salary"
            className="form-control"
            onChange={formik.handleChange}
            value={formik.values.salary}
            id="salary"
          />
          {formik.touched.salary && formik.errors.salary && (
            <div className="text-danger">{formik.errors.salary}</div>
          )}
        </div>

        {/* Designation */}
        <div className="mb-3">
          <label htmlFor="designation" className="form-label">Designation</label>
          <select
            name="designation"
            className="form-select"
            onChange={formik.handleChange}
            value={formik.values.designation}
            id="designation"
          >
            <option value="">Select Designation</option>
            <option value="Python Developer">Python Developer</option>
            <option value="Java Developer">Java Developer</option>
            <option value="Php Developer">Php Developer</option>
            <option value="React Js Developer">React Js Developer</option>
          </select>
          {formik.touched.designation && formik.errors.designation && (
            <div className="text-danger">{formik.errors.designation}</div>
          )}
        </div>

        {/* Joined Date */}
        <div className="mb-3">
          <label htmlFor="joined_date" className="form-label">Joined Date</label>
          <input
            type="date"
            name="joined_date"
            className="form-control"
            onChange={formik.handleChange}
            value={formik.values.joined_date}
            id="joined_date"
          />
          {formik.touched.joined_date && formik.errors.joined_date && (
            <div className="text-danger">{formik.errors.joined_date}</div>
          )}
        </div>

        {/* Photo */}
        <div className="mb-3">
          <label htmlFor="photo" className="form-label">Photo</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            className="form-control"
            onChange={(event) => formik.setFieldValue("photo", event.currentTarget.files[0])}
            id="photo"
          />
        </div>

        {/* Submit Button */}
        <div className="d-flex justify-content-between mt-4">
          <button className="btn btn-primary" type="submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? "Adding Employee..." : "Add Employee"}
          </button>
          <Link to="/dashboard" className="btn btn-success ms-3">
            Back to Dashboard
          </Link>
        </div>
      </form>
    </div>
  );
}
