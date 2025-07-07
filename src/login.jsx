import axios from "axios"
import { useFormik } from "formik"
import { useNavigate } from "react-router-dom"
import * as yup from "yup"
export function Login(){
   const navigate = useNavigate()
    const formik = useFormik({
  initialValues: {
    username: '',
    password: ''
  },
  validationSchema: yup.object({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required')
  }),
  onSubmit: async (formData, { setSubmitting, setStatus }) => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/login/`, formData);
      
      // Example: storing token in localStorage
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);

      setStatus({ success: "Login successful!" });
      // You can redirect to dashboard here
      navigate('/dashboard')
    } catch (error) {
      setStatus({
        error: "Invalid username or password"
      });
    } finally {
      setSubmitting(false);
    }
  }
});
    return(
        <div className="container d-flex align-items-center justify-content-center" style={{marginTop:'20vh'}}>
            <form className="border border-2 w-25 p-4" onSubmit={formik.handleSubmit}>
                <h2><i className="bi bi-person-fill"></i>Admin Login</h2>
                <dl>
                    <dt>Username</dt>
                    <dd><input type="text" name='username' id='username' className="form-control" onChange={formik.handleChange}/></dd>
                    <dd className="text-danger">{formik.errors.username}</dd>
                    <dt>Password</dt>
                    <dd><input type="password" name='password' id='password' className="form-control" onChange={formik.handleChange}/></dd>
                    <dd className="text-danger">{formik.errors.password}</dd>
                </dl>
                <button className="btn btn-primary w-100" type="submit" disabled={formik.isSubmitting}>{formik.isSubmitting?'Logging in...':'Login'}</button>
                {/*<div className="text-center m-2">
                    <span>Don't have an account? <Link to='/signup' className="text-primary">Sign up</Link></span>
                </div>*/}
            </form>
              
        </div>
    )
}