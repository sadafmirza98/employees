import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { EmployeeProvider } from "./context/EmployeeContext";
import EmployeeList from "./components/EmployeeList";
import EmployeeForm from "./components/EmployeeForm";

const App = () => (
  <EmployeeProvider>
    <Router>
      <Routes>
        <Route path="/" element={<EmployeeList />} />
        <Route path="/add" element={<EmployeeForm />} />
        <Route path="/edit/:id" element={<EmployeeForm />} />
      </Routes>
    </Router>
  </EmployeeProvider>
);

export default App;
