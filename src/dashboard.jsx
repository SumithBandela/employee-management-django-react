import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
    const [employees, setEmployees] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const [, setCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedRow, setExpandedRow] = useState(null);
    const accessToken = localStorage.getItem("access");
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const fetchEmployees = (page = 1, search = searchQuery) => {
    axios
        .get(`http://127.0.0.1:8000/api/employees/?page=${page}&search=${search}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then((response) => {
            setEmployees(response.data.results);
            setNextPage(response.data.next);
            setPrevPage(response.data.previous);
            setCount(response.data.count);
            setCurrentPage(page);
        })
        .catch((error) => {
            console.error("Error fetching employees:", error);
        });
    };
  

    useEffect(() => {
        fetchEmployees();
    }, [accessToken]);

    function toggleDetails(id) {
        setExpandedRow(expandedRow === id ? null : id);
    }

    function logout() {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
    }

    return (
        <div className="container mt-5">
            <h2 className="text-center text-success mb-4">Employee Dashboard</h2>

            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-primary" onClick={() => navigate("add")}>
                    Add Employee
                </button>
                <button className="btn btn-secondary mx-2" onClick={() => navigate("password-change")}>
                    Change Password
                </button>
                <button className="btn btn-danger" onClick={logout}>
                    Logout
                </button>
            </div>
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name, email or designation"
                    value={searchQuery}
                    onChange={(e) => {
                        const query = e.target.value;
                        setSearchQuery(query);
                        fetchEmployees(1, query); // Reset to page 1 with search
                    }}
                />
            </div>

            {employees.length === 0 ? (
                <p className="text-center">No employees found.</p>
            ) : (
                <>
                    {employees.map((employee) => (
                        <div key={employee.id} className="card mb-3 shadow-sm">
                            <div className="card-body d-flex align-items-center">
                                <img
                                    src={
                                        employee.photo
                                            ? `http://127.0.0.1:8000${employee.photo}`
                                            : "https://via.placeholder.com/80"
                                    }
                                    alt="Employee"
                                    className="img-thumbnail me-3"
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        objectFit: "cover",
                                        borderRadius: "50%",
                                    }}
                                />

                                <div className="flex-grow-1">
                                    <h5 className="mb-1">
                                        {employee.firstname} {employee.lastname}
                                    </h5>
                                    <p className="mb-0 text-muted">{employee.email}</p>
                                </div>

                                <div>
                                    <button
                                        className="btn btn-info btn-sm me-2"
                                        onClick={() => toggleDetails(employee.id)}
                                    >
                                        {expandedRow === employee.id ? "Hide" : "View"}
                                    </button>
                                    <button
                                        className="btn btn-outline-primary btn-sm me-2"
                                        onClick={() => navigate(`edit/${employee.id}`)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => navigate(`delete/${employee.id}`)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            {expandedRow === employee.id && (
                                <div className="card-footer bg-light">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <strong>Phone:</strong> {employee.phone}
                                        </div>
                                        <div className="col-md-4">
                                            <strong>Designation:</strong> {employee.designation}
                                        </div>
                                        <div className="col-md-4">
                                            <strong>Salary:</strong> ₹{employee.salary}
                                        </div>
                                        <div className="col-md-4">
                                            <strong>Joined Date:</strong> {employee.joined_date}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Pagination Buttons */}
                    <div className="d-flex justify-content-between align-items-center">
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => fetchEmployees(currentPage - 1)}
                            disabled={!prevPage}
                        >
                            Previous
                        </button>
                        <span>Page {currentPage}</span>
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => fetchEmployees(currentPage + 1)}
                            disabled={!nextPage}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
