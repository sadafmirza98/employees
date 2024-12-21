import React, { useContext, useEffect } from "react";
import { EmployeeContext } from "../context/EmployeeContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import "../App.css";

const EmployeeList = () => {
  const { employees, setEmployees } = useContext(EmployeeContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/employees");

        const formattedEmployees = response.data.map((employee) => {
          const dobDate = new Date(employee.dob);
          const day = String(dobDate.getDate()).padStart(2, "0");
          const month = String(dobDate.getMonth() + 1).padStart(2, "0");
          const year = dobDate.getFullYear();
          const formattedDob = `${day}-${month}-${year}`;

          return {
            ...employee,
            dob: formattedDob,
          };
        });

        setEmployees(formattedEmployees);
      } catch (error) {
        console.error("Error fetching employees:", error);
        alert("Error fetching employee data.");
      }
    };

    fetchEmployees();
  }, [setEmployees]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      const updatedEmployees = employees.filter(
        (employee) => employee.id !== id
      );
      setEmployees(updatedEmployees);
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Error deleting the employee.");
    }
  };

  return (
    <div className="container">
      <Button
        variant="contained"
        color="primary"
        className="add-employee-btn"
        onClick={() => navigate("/add")}
      >
        Add Employee
      </Button>
      <div className="employee-table-container">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Date of Birth</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.dob}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => navigate(`/edit/${employee.id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDelete(employee.id)}
                      style={{ marginLeft: "20px" }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default EmployeeList;
