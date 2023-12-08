import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Button, Container } from "@mui/material";
import env from "react-dotenv";
import country from "../Api/countriess.json";
import employeeRole from "../jsonlist/employeeRole.json"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
  validatePhoneNumber,
  validateUsername,
  validateEmail,
  validatePassword
} from "../components/Validation";
import { auth } from "../firebase.mjs";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 4,
};


export default function AddEmployee({ COMPANY_ID, COMPANY_USERNAME, COMPANY_PARENT_ID, COMPANY_PARENT_USERNAME, refetch }) {
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [createEmployee, setCreateEmployee] = useState({
    EMPLOYEE_NAME: "",
    EMPLOYEE_EMAIL: "",
    EMPLOYEE_COUNTRY: "",
    EMPLOYEE_STATE: "",
    EMPLOYEE_CITY: "",
    EMPLOYEE_PHONE: "",
    EMPLOYEE_HOURLY_WAGE: "",
    EMPLOYEE_ROLE: "",
    EMPLOYEE_EMPLMNTTYPE: "",
    EMPLOYEE_DOB: "",
    EMPLOYEE_HIRE_DATE: "",
    EMPLOYEE_ADD: "",
    EMPLOYEE_USERNAME: "",
    EMPLOYEE_PASSWORD: "",
    EMPLOYEE_MEMBER_PARENT_USERNAME: "",
    EMPLOYEE_PARENT_ID: "",
    EMPLOYEE_PARENT_USERNAME: "",
    EMPLOYEE_MEMBER_PARENT_ID: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");




  useEffect(() => {
    setCreateEmployee((prevState) => ({ ...prevState, EMPLOYEE_MEMBER_PARENT_USERNAME: COMPANY_PARENT_USERNAME }));
    setCreateEmployee((prevState) => ({ ...prevState, EMPLOYEE_PARENT_ID: COMPANY_ID }));
    setCreateEmployee((prevState) => ({ ...prevState, EMPLOYEE_PARENT_USERNAME: COMPANY_USERNAME }));
    setCreateEmployee((prevState) => ({ ...prevState, EMPLOYEE_MEMBER_PARENT_ID: COMPANY_PARENT_ID }));
  }, [open])


  const availableState = country?.find(
    (c) => c.name === createEmployee.EMPLOYEE_COUNTRY
  );

  const availableCities = availableState?.states?.find(
    (s) => s.name === createEmployee.EMPLOYEE_STATE
  );


  const headers = {
    "Content-Type": "application/json",
    authorization_key: "qzOUsBmZFgMDlwGtrgYypxUz",
  };



  // const handleCreate = (e) => {
  //   setCreateEmployee({ ...createEmployee, [e.target.name]: e.target.value });
  // };

  const handleCreate = (e) => {
    const { name, value } = e.target;
    setCreateEmployee((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    // Clear previous validation errors
    setPhoneError("");
    setUsernameError("");
    setEmailError("");
    setPasswordError("");

    // Validate phone number, username, and email fields
    const isValidPhoneNumber = validatePhoneNumber(createEmployee.EMPLOYEE_PHONE);
    const isValidUsername = validateUsername(createEmployee.EMPLOYEE_USERNAME);
    const isValidEmail = validateEmail(createEmployee.EMPLOYEE_EMAIL);
    const isValidPassword = validatePassword(createEmployee.EMPLOYEE_PASSWORD);
    const isValidName = createEmployee.EMPLOYEE_NAME != "";

    if (!isValidPhoneNumber) {
      setPhoneError("Invalid phone number");
      return;
    }

    // if (!isValidUsername) {
    //   setUsernameError("Invalid username");
    //   return;
    // }

    if (!isValidEmail) {
      setEmailError("Invalid email address");
      return;
    }

    if (!isValidPassword) {
      setPasswordError("Invalid password");
      return;
    }

    if (!isValidName) {
      setNameError("Name should not be empty");
      return;
    }
    

    // Perform API validation and request
    axios
      .post("/api/create_employee", createEmployee, {
        headers,
      })
      .then((response) => {
        if (response.data.operation === "failed") {
          setUsernameError(response.data.errorMsg)
        } else if (response.data.operation === "successfull") {
          toast.success("Employee Created successfully!", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
            
          });
          // handleSubmission()
          refetch()
          setOpen(false);

        }
      })
      .catch((error) => {
        console.error(error, "ERR");
      });
  };


  return (
    < >
      <Button
        size="small"
        variant={"outlined"}
        className={"btn button border-bottom-0 bg-white"}
      >
        My Employees
      </Button>
      <button
        onClick={handleOpen}
        sx={{ color: "#277099" }}
        className="btn btn-sm btn-primary rounded-0 border-0  rounded-0 text-light"
        // variant="contained"
        size="small"
      >
        + Add New Employee
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Container
          id="content"
          style={{ height: "100vh", position: "relative" }}
          maxWidth="xl"
        >
          <Box className="modal-content">
            <form onSubmit={handleSubmit} className="overflow-auto overflow-x-hidden">
              <h5>Create Employee</h5>
              <div className="row py-1">
                <div className="form-group col-xl-6">
                  <label for="inputqual">Employee Username</label>
                  <input
                    type="text"
                    className={`form-control form-control-2 rounded-0 ${usernameError ? "is-invalid" : ""
                      }`}
                    placeholder="Enter Employee Username"
                    value={createEmployee.EMPLOYEE_USERNAME}
                    name="EMPLOYEE_USERNAME"
                    onChange={handleCreate}
                    label="Company username"
                  />
                  {usernameError && (
                    <div className="invalid-feedback">{usernameError}</div>
                  )}
                </div>
                <div className="form-group col-xl-6">
                  <label>Employee Name</label>
                  <input
                    type="text"
                    className={`form-control form-control-2 rounded-0 ${nameError ? "is-invalid" : ""
                      }`}
                    id="empName"
                    placeholder="Enter Employee name"
                    value={createEmployee.EMPLOYEE_NAME}
                    name="EMPLOYEE_NAME"
                    onChange={handleCreate}
                  />
                  {nameError && (
                    <div className="invalid-feedback">{nameError}</div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="form-group col-xl-6 py-1">
                  <label>E-mail</label>
                  <input
                    type="email"
                    className={`form-control form-control-2 rounded-0 ${emailError ? "is-invalid" : ""
                      }`}
                    id="email"
                    placeholder="Enter Email address"
                    value={createEmployee.EMPLOYEE_EMAIL}
                    name="EMPLOYEE_EMAIL"
                    onChange={handleCreate}
                    label="email"
                  />
                  {emailError && (
                    <div className="invalid-feedback">{emailError}</div>
                  )}
                </div>
                <div className="form-group col-xl-6 py-1">

                  <label for="inputPassword4">Date Of Birth</label>
                  <input
                    type="date"
                    className="form-control form-control-2 rounded-0"
                    id="inputPassword4"
                    placeholder="Enter Date of birth"
                    value={createEmployee.EMPLOYEE_DOB}
                    name="EMPLOYEE_DOB"
                    onChange={handleCreate}
                    required
                  />
                </div>{" "}
                <div className="form-group col-xl-6 py-1">
                  <label>Phone</label>
                  <input
                    type="number"
                    className={`form-control form-control-2 rounded-0 ${phoneError ? "is-invalid" : ""
                      }`}
                    id="phone"
                    placeholder="Enter Your Number"
                    value={createEmployee.EMPLOYEE_PHONE}
                    name="EMPLOYEE_PHONE"
                    onChange={handleCreate}
                  />
                  {phoneError && (
                    <div className="invalid-feedback">{phoneError}</div>
                  )}
                </div>
                <div className="form-group col-xl-6 py-1">
                  <label>Employee Password</label>
                  <input
                    type="text"
                    className={`form-control form-control-2 rounded-0 ${passwordError ? "is-invalid" : ""
                      }`}
                    placeholder="Enter Employee password"
                    value={createEmployee.EMPLOYEE_PASSWORD}
                    name="EMPLOYEE_PASSWORD"
                    onChange={handleCreate}
                  />
                  {passwordError && (
                    <div className="invalid-feedback">{passwordError}</div>
                  )}
                </div>
                <div className="form-group col-xl-6 py-1">

                  <label>Country</label>

                  <select
                    className="form-control form-control-2 border rounded-0"
                    placeholder="Country"
                    name="EMPLOYEE_COUNTRY"
                    value={createEmployee.EMPLOYEE_COUNTRY}
                    onChange={handleCreate}
                  >
                    <option value="">--Choose Country--</option>
                    {country?.map((value, key) => {
                      // console.log("hhh", value.name)
                      return (
                        <option value={value.name} key={key}>
                          {value.name}
                        </option>
                      );
                    })}
                  </select>

                </div>
                <div className="form-group col-xl-6 py-1">
                  <label>State</label>
                  <select
                    className="form-control form-control-2 border rounded-0"
                    placeholder="State"
                    name="EMPLOYEE_STATE"
                    value={createEmployee.EMPLOYEE_STATE}
                    onChange={handleCreate}
                  >
                    <option value="">--Choose State--</option>
                    {availableState?.states?.map((e, key) => {
                      return (
                        <option value={e.name} key={key}>
                          {e.name}
                        </option>
                      );
                    })}
                  </select>

                </div>
              </div>
              <div className="row">
                <div className="row">
                  <div className="form-group col-xl-12 py-1">
                    <label for="inputAddress">Address</label>
                    <textarea
                      type="text"
                      className="form-control rounded-0 w-100"
                      id="inputAddress"
                      placeholder="Enter Address"
                      value={createEmployee.EMPLOYEE_ADD}
                      name="EMPLOYEE_ADD"
                      onChange={handleCreate}
                    />
                  </div>
                </div>
                <div className="form-group col-xl-4 py-1">
                  <label>City</label>
                  <select
                    className="form-control form-control-2 border rounded-0"
                    placeholder="City"
                    name="EMPLOYEE_CITY"
                    value={createEmployee.EMPLOYEE_CITY}
                    onChange={handleCreate}
                  >
                    <option value="">--Choose City--</option>
                    {availableCities?.cities?.map((e, key) => {
                      return (
                        <option value={e.name} key={key}>
                          {e.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="form-group col-xl-4 py-1">
                  <label>Hourly wages</label>
                  <input
                    type="number"
                    className="form-control form-control-2 rounded-0"
                    id="hourlywage"
                    placeholder="Enter your Hourly wages"
                    value={createEmployee.EMPLOYEE_HOURLY_WAGE}
                    name="EMPLOYEE_HOURLY_WAGE"
                    onChange={handleCreate}
                  />
                </div>
                <div className="form-group col-xl-4 py-1">
                  <label for="inputPassword4">Employee Role</label>
                  <select
                    id="inputqual"
                    className="form-control form-control-2 rounded-0 border"
                    value={createEmployee.EMPLOYEE_ROLE}
                    name="EMPLOYEE_ROLE"
                    onChange={handleCreate}
                  >
                    <option selected>Choose role...</option>
                    {employeeRole.map((roles, index) => {
                      return (
                        <option>{roles}</option>
                      )
                    })}

                  </select>

                </div>
              </div>
              <div className="row">
                <div className="form-group col-xl-4 py-1 ">
                  <label for="inputqual">Employement Type</label>
                  <select
                    id="inputqual"
                    className="form-control form-control-2 rounded-0 border"
                    value={createEmployee.EMPLOYEE_EMPLMNTTYPE}
                    name="EMPLOYEE_EMPLMNTTYPE"
                    onChange={handleCreate}
                  >
                    <option selected>Choose type...</option>
                    <option>Permanent</option>
                    <option>Contract</option>
                    <option>Trainee</option>
                    <option>other</option>
                  </select>
                </div>

                <div className="form-group col-xl-4 py-1">
                  <label for="inputPassword4">Hired Date</label>
                  <input
                    type="date"
                    className="form-control form-control-2 rounded-0"
                    id="inputPassword4"
                    placeholder="Enter hire date"
                    value={createEmployee.EMPLOYEE_HIRE_DATE}
                    name="EMPLOYEE_HIRE_DATE"
                    onChange={handleCreate}
                  />
                </div>
              </div>

              <div className="py-2">

                <button
                  type="submit"
                  className="btn btn-info text-white btn-sm"
                  onClick={handleSubmit}
                >
                  Create Employee
                </button>{" "}
                <button
                  onClick={handleClose}
                  className="btn btn-danger text-white btn-sm"
                >
                  Cancel
                </button>
              </div>

            </form>
          </Box>
        </Container>
      </Modal>
    </>
  );
}