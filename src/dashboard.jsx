import { useEffect, useState } from "react"
import { StatCard } from "./statcard"
import { Link } from "react-router-dom";
import axios from "axios";

export function Dashboard()
{
    const [stats, setStats] = useState({});
    useEffect(()=>{
     axios.get("http://localhost:8000/api/dashboard/")
      .then((res) => {
        setStats(res.data);
        console.log(res.data)
      })
      .catch((err) => {
        console.error("Error fetching dashboard data:", err);

      });
    },[])

     function logout() {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
    }

    return(
         <div className="container mt-5">
                <h2 className="text-center mb-4">📊 Dashboard</h2>
                <div className="d-flex justify-content-end mb-4">
                    <Link to="employee-dashboard" className="btn btn-primary">
                    Go to Employee Dashboard
                    </Link>
                    <Link to="password-change" className="btn btn-outline-secondary mx-2">
                    Change Password
                    </Link>
                    <button className="btn btn-outline-danger" onClick={logout}>
                    Logout
                    </button>
                </div>
                <div className="row g-4">
                    <StatCard label="Total Users" value={stats.total_users} />
                    <StatCard label="New Signups Today" value={stats.new_signups_today} />
                    <StatCard label="Total Employees" value={stats.total_employees} />
                </div>
            </div>
    )
}