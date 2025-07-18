import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";

export function EditEmployee() {
  const [employee, setEmployee] = useState({});
  let { id } = useParams();
  let navigate = useNavigate()
  const accessToken = localStorage.getItem("access");
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/employees/${id}/`,{
      headers:{
           Authorization: `Bearer ${accessToken}`
      }
      
    })
      .then(response => {
        setEmployee(response.data);
      });
  }, [id,accessToken]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstname: employee.firstname || "",
      lastname: employee.lastname || "",
      email: employee.email || "",
      phone: employee.phone || "",
      designation: employee.designation || "",
      salary: employee.salary || "",
      joined_date: employee.joined_date || "",
      photo: null
    },
    validationSchema: yup.object({
      firstname: yup.string().required('Firstname is required'),
      lastname: yup.string().required('Lastname is required'),
      email: yup.string().email('Invalid email').required('Email is required'),
      phone: yup.string().matches(/^\d{10}$/, "Invalid phone number").required("Phone number is required"),
      salary: yup.string().required('Salary is required')
    }),
    onSubmit: async (formData) => {
      try {
        const form = new FormData();
        for (const key in formData) {
          if (formData[key]) {
            form.append(key, formData[key]);
          }
        }

        await axios.put(`http://127.0.0.1:8000/api/employees/${id}/`, form, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`
          },
        });

        alert('Employee updated successfully!');
        navigate('/dashboard/employee-dashboard')
        
      } catch (error) {
        console.error('Error updating employee:', error.response?.data || error.message);
      }
    }
  });

  return (
    <div className="d-flex justify-content-center align-items-center mt-5 container">
      <form
        className="m-2 p-4 w-75 w-md-75 w-lg-50 border border-2 bg-white shadow-lg rounded"
        onSubmit={formik.handleSubmit}
        encType="multipart/form-data"
      >
        <h2 className="text-center text-primary mb-4">
          <i className="bi bi-pen-fill me-2"></i>Edit Employee
        </h2>

        {/* Firstname */}
        <div className="mb-3">
          <label htmlFor="firstname" className="form-label">Firstname</label>
          <input
            type="text"
            name="firstname"
            id="firstname"
            className="form-control"
            onChange={formik.handleChange}
            value={formik.values.firstname}
          />
          {formik.touched.firstname && formik.errors.firstname && (
            <div className="text-danger">{formik.errors.firstname}</div>
          )}
        </div>

        {/* Lastname */}
        <div className="mb-3">
          <label htmlFor="lastname" className="form-label">Lastname</label>
          <input
            type="text"
            name="lastname"
            id="lastname"
            className="form-control"
            onChange={formik.handleChange}
            value={formik.values.lastname}
          />
          {formik.touched.lastname && formik.errors.lastname && (
            <div className="text-danger">{formik.errors.lastname}</div>
          )}
        </div>

        {/* Email */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            className="form-control"
            onChange={formik.handleChange}
            value={formik.values.email}
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
            id="phone"
            className="form-control"
            onChange={formik.handleChange}
            value={formik.values.phone}
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
            id="salary"
            className="form-control"
            onChange={formik.handleChange}
            value={formik.values.salary}
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
            id="designation"
            className="form-select"
            onChange={formik.handleChange}
            value={formik.values.designation}
          >
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
            id="joined_date"
            className="form-control"
            onChange={formik.handleChange}
            value={formik.values.joined_date}
          />
          {formik.touched.joined_date && formik.errors.joined_date && (
            <div className="text-danger">{formik.errors.joined_date}</div>
          )}
        </div>

        {/* Photo Upload */}
        <div className="mb-3">
          <label htmlFor="photo" className="form-label">Photo</label>
          <input
            type="file"
            name="photo"
            id="photo"
            accept="image/*"
            className="form-control"
            onChange={(event) => formik.setFieldValue("photo", event.currentTarget.files[0])}
          />
        </div>

        {/* Display Current Photo */}
        {employee?.photo && (
          <div className="mb-3">
            <img
              src={`http://127.0.0.1:8000${employee.photo}`}
              alt="Current Employee"
              width="100"
              className="mt-2"
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="d-flex justify-content-between mt-4">
          <button className="btn btn-primary" type="submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? "Updating..." : "Update"}
          </button>
          <Link to="/dashboard/employee-dashboard" className="btn btn-success ms-3">
            Back to Dashboard
          </Link>
        </div>
      </form>
    </div>
  );
}
