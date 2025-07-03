import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
export function Dashboard(){
    const[employees,setEmployee] = useState([])
    const accessToken = localStorage.getItem('access');
    let navigate = useNavigate()
    useEffect(()=>{
        axios.get('http://127.0.0.1:8000/api/employees', {
  headers: {
    Authorization: `Bearer ${accessToken}`
  }
  })
        .then(response=>{
            setEmployee(response.data)
        })
    },[accessToken])

    function logout() {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = "/login";
    }

        return(
            <div className="container m-5 p-3">
                <h2 className="text-center mb-2 text-success">All Employees</h2>
                <table className="table table-bordered mt-2">
                    <thead>
                        <tr>
                            <th>Firstname</th>
                            <th>Lastname</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Designation</th>
                            <th>Salary</th>
                            <th>Joined Date</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            employees.map(employee=>
                                <tr key={employee.id}>
                                    <td>{employee.firstname}</td>
                                    <td>{employee.lastname}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.phone}</td>
                                    <td>{employee.designation}</td>
                                    <td>{employee.salary}</td>
                                    <td>{employee.joined_date}</td>
                                    <td onClick={()=>{navigate(`edit/${employee.id}`)}} className="text-primary btn">Edit</td>
                                    <td onClick={()=>{navigate(`delete/${employee.id}`)}} className="text-primary">Delete</td>
                                </tr>
                            )
                        }
                        <button className="btn btn-primary mt-3" onClick={()=>navigate(`add`)}>Add Employee</button>
                        <button onClick={logout} className="ms-2 btn btn-danger mt-3">logout</button>
                    </tbody>
                </table>
            </div>
        )
}