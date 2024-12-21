import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EmployeeContext } from "../context/EmployeeContext";
import axios from "axios";
import "../App.css";
import { TextField, Button } from "@mui/material";

const EmployeeForm = () => {
  const { employees, setEmployees } = useContext(EmployeeContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    address: "",
    photo: null,
  });
  const [errors, setErrors] = useState({});
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      const employeeToEdit = employees.find((emp) => emp.id === parseInt(id));

      const dob = new Date(employeeToEdit.dob);
      const day = String(dob.getDate()).padStart(2, "0");
      const month = String(dob.getMonth() + 1).padStart(2, "0");
      const year = dob.getFullYear();

      const formattedDob = `${year}-${month}-${day}`;

      const photo = employeeToEdit.photo
        ? typeof employeeToEdit.photo === "string"
          ? JSON.parse(employeeToEdit.photo)
          : employeeToEdit.photo
        : null;

      setFormData({
        name: employeeToEdit.name,
        email: employeeToEdit.email,
        dob: formattedDob,
        address: employeeToEdit.address,
        photo: photo,
      });
    }
  }, [id, employees, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    const photoObject = {
      data: file,
      filename: file.name,
    };

    setFormData((prevData) => ({
      ...prevData,
      photo: photoObject,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const dataToSend = new FormData();
        dataToSend.append("name", formData.name);
        dataToSend.append("email", formData.email);
        dataToSend.append("dob", formData.dob);
        dataToSend.append("address", formData.address);

        if (formData.photo) {
          if (formData.photo.data instanceof File) {
            const photoData = {
              data: await readFileAsBuffer(formData.photo.data),
              filename: formData.photo.filename,
            };
            dataToSend.append("photo", JSON.stringify(photoData));
          } else {
            dataToSend.append("photo", JSON.stringify(formData.photo));
          }
        }

        const response = isEditMode
          ? await axios.put(
              `http://localhost:5000/api/employees/${id}`,
              dataToSend,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            )
          : await axios.post(
              "http://localhost:5000/api/employees",
              dataToSend,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );

        const employeeData = response.data;

        if (isEditMode) {
          setEmployees((prevEmployees) =>
            prevEmployees.map((emp) =>
              emp.id === employeeData.id ? employeeData : emp
            )
          );
        } else {
          setEmployees((prevEmployees) => [...prevEmployees, employeeData]);
        }

        navigate("/");
      } catch (error) {
        console.error("Error submitting employee:", error);
        alert("An error occurred while saving the employee.");
      }
    }
  };

  const readFileAsBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const validateForm = () => {
    const errors = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!formData.name || !nameRegex.test(formData.name)) {
      errors.name =
        "Name is required and should only contain alphabets and spaces.";
    }
    if (!formData.email || !emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <div className="employee-form-container">
      <h2>{isEditMode ? "Edit Employee" : "Add Employee"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            error={Boolean(errors.name)}
            helperText={errors.name}
            required
          />
        </div>
        <div className="form-group">
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            error={Boolean(errors.email)}
            helperText={errors.email}
            required
          />
        </div>
        <div className="form-group">
          <TextField
            label="Date of Birth"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div className="form-group">
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            fullWidth
          />
        </div>
        <div className="form-group">
          <input
            type="file"
            accept="image/*"
            name="photo"
            onChange={handleFileChange}
          />
          {/* Display selected file name if a photo is selected */}
          {formData.photo && formData.photo.filename && (
            <span style={{ color: "grey" }}>{formData.photo.filename}</span>
          )}
        </div>
        <div>
          <Button type="submit" variant="contained" color="primary">
            {isEditMode ? "Update" : "Add"} Employee
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/")}
            style={{ marginLeft: "20px" }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
