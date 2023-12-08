
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { companyAdded} from "../redux/slice/createCompany.js"; // Update with your actual path
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import axios from "axios";
import { Button, Container } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import country from "../Api/countriess.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SimpleBackdrop from "../components/Backdrop";
import { validateEmail, validatePhoneNumber } from "../components/Validation";
import companytype from "../jsonlist/typeOfCompany.json";
import { auth } from "../firebase";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import { setUser } from "../redux/slice/adminSlice.js";

const CompanyCreate = (props) => {
  

  const adminData = useSelector((state) => state.adminLogin.user);
  console.log(adminData);
 
  const dispatch = useDispatch();
  // const companies = useSelector((state) => state.company.companies);

  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [create_company, setCreate_company] = useState({
    COMPANY_NAME: "",
    COMPANY_USERNAME: "",
    COMPANY_PHONE: "",
    COMPANY_ROLE: "",
    COMPANY_ADD2: "",
    COMPANY_STATE: "",
    COMPANY_CITY: "",
    COMPANY_COUNTRY: "",
    COMPANY_SUBSCRIPTION: "",
    COMPANY_STATUS: "",
  });

  const [emailError, setEmailError] = useState("");
  const [companyphoneError, setCompanyPhoneError] = useState("");
  const [companynameError, setCompanynameError] = useState("");

  const handleCreate = (e) => {
    setCreate_company({ ...create_company, [e.target.name]: e.target.value });
  };

  const availableState = country?.find(
    (c) => c.name === create_company.COMPANY_COUNTRY
  );

  const availableCities = availableState?.states?.find((s) => {
    return s.name === create_company.COMPANY_STATE;
  });

  // useEffect(() => {
  //   dispatch(getAllCompanies({


  //   }));
  // }, [dispatch]);

  const list = companytype;

  const handleSubmit = (e) => {
    e.preventDefault();

    setCompanynameError("");
    setEmailError("");
    setCompanyPhoneError("");
    setErrorMsg("");

    const isValidCompanyname = create_company.COMPANY_NAME !== "";
    const isValidPhone = validatePhoneNumber(create_company.COMPANY_PHONE);
    const isValidEmail = validateEmail(create_company.COMPANY_USERNAME);

    if (!isValidCompanyname) {
      setCompanynameError("Name should not be empty");
      return;
    }

    if (!isValidEmail) {
      setEmailError("Invalid email address");
      return;
    }

    if (!isValidPhone) {
      setCompanyPhoneError(
        "Invalid phone number or field should not be empty"
      );
      return;
    }

    axios
      .post(`/api/create_company`, {
        COMPANY_PARENT_ID: adminData.ADMIN_ID,
        COMPANY_PARENT_USERNAME: adminData.ADMIN_USERNAME,
        ...create_company,
      })
      .then((response) => {
        if (response.data.operation === "failed") {
          setErrorMsg(response.data.errorMsg);
          setEmailError(response.data.errorMsg ? "Email already exist" : "");
        } else if (response.data.operation === "successfull") {
          // Dispatch action to add the new company to the Redux store
          dispatch(companyAdded(response.data.result));
          dispatch(setUser(response.data.updatedUserData));

          toast.success("Company Created successfully!", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
          });

          setOpen(false);
        }
      })
      .catch((error) => {
        console.error(error, "ERR");
        toast.error("An error occurred. Please try again later.", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
      });
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="btn btn-primary btn-sm my-2"
        style={{ width: "fit-content" }}
      >
        <AddIcon /> Add Company
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
          <form className="p-4 overflow-auto">
//               <h5>Create company</h5>
//               <div className="row">
//                 <div className="form-group py-2 col-xl-6">
//                   <label>Company name</label>
//                   <input
                    type="text"
                    className={`form-control form-control-2 rounded-0 ${companynameError ? "is-invalid" : ""
                      }`}
                    placeholder="Enter company name"
                    value={create_company.COMPANY_NAME}
                    name="COMPANY_NAME"
                    onChange={handleCreate}
                    label=""
                  />
                  {companynameError && (
                    <div className="invalid-feedback">{companynameError}</div>
                  )}
                </div>
                {/* Username */}
                <div className="form-group py-2 col-xl-6">
                  <label>Company Email</label>
                  <input
                    type="text"
                    className={`form-control form-control-2 rounded-0 ${emailError ? "is-invalid" : ""
                      }`}
                    placeholder="Email address"
                    value={create_company.COMPANY_USERNAME}
                    name="COMPANY_USERNAME"
                    onChange={handleCreate}
                    label="Company Email"
                  />

                  {emailError && (
                    <div className="invalid-feedback">{emailError}</div>
                  )}
                </div>
              </div>
              <div className="row">
                {/* Phone Number */}
                <div className="form-group py-2 col-xl-6">
                  <label>Phone Number</label>
                  <input
                    type="number"
                    className={`form-control form-control-2 rounded-0 ${companyphoneError ? "is-invalid" : ""
                      }`}
                    placeholder="Enter Number"
                    value={create_company.COMPANY_PHONE}
                    name="COMPANY_PHONE"
                    onChange={handleCreate}
                    label="Phone Number"
                  />
                  {companyphoneError && (
                    <div className="invalid-feedback">{companyphoneError}</div>
                  )}

                </div>

              </div>
              <div className="row py-2">
                <div className="form-group col-xl-4">
                  <label>Company Type</label>
                  <select
                    className="form-control form-control-2 border  rounded-0"
                    name="COMPANY_ROLE"
                    value={create_company.COMPANY_ROLE}
                    onChange={handleCreate}
                  >
                    <option selected>Choose...</option>

                    {list.map((e, key) => {
                      return (
                        <option value={e} key={key}>
                          {e}
                        </option>
                      );
                    })}
                  </select>
                </div>


                <div className="form-group col-xl-4">
                  <label>Subscription Type</label>
                  <select
                    className="form-control form-control-2 border rounded-0"
                    name="COMPANY_SUBSCRIPTION"
                    value={create_company.COMPANY_SUBSCRIPTION}
                    onChange={handleCreate}
                  >
                    <option selected>--Select Subscription--</option>
                    <option selected>Monthly</option>
                    <option selected> Annual</option>
                  </select>
                </div>

                <div className="form-group col-xl-4">
                  <label>Company Status</label>
                  <select
                    className="form-control form-control-2 border rounded-0"
                    name="COMPANY_STATUS"
                    value={create_company.COMPANY_STATUS}
                    onChange={handleCreate}
                  >
                    <option selected>--Select Status--</option>
                    <option selected>Active</option>
                    <option selected> Inactive</option>
                  </select>
                </div>
              </div>


              <div className="row py-2">
                <div className="form-group col-xl-4">
                  <label>Country</label>
                  <select
                    className="form-control form-control-2 border  rounded-0"
                    name="COMPANY_COUNTRY"
                    value={create_company.COMPANY_COUNTRY}
                    onChange={handleCreate}
                  >
                    <option selected>--Choose Country--</option>

                    {country.map((e, key) => {
                      return (
                        <option value={e.name} key={key}>
                          {e.name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="form-group col-xl-4">
                  <label>State</label>
                  <select
                    className="form-control form-control-2 border  rounded-0"
                    name="COMPANY_STATE"
                    value={create_company.COMPANY_STATE}
                    onChange={handleCreate}
                  >
                    <option>--Choose State--</option>
                    {availableState?.states?.map((e, key) => {
                      return (
                        <option value={e.name} key={key}>
                          {e.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="form-group col-xl-4">
                  <label>City</label>
                  <select
                    className="form-control form-control-2 border rounded-0"
                    name="COMPANY_CITY"
                    value={create_company.COMPANY_CITY}
                    onChange={handleCreate}
                  >
                    <option selected>--Choose City--</option>
                    {availableCities?.cities?.map((e, key) => {
                      return (
                        <option value={e.name} key={key}>
                          {e.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="row py-2">
                <div className="form-group col-xl-12">
                  <label>Address</label>
                  <textarea
                    type="text"
                    className="form-control rounded-0"
                    placeholder="Apartment, studio, or floor"
                    name="COMPANY_ADD2"
                    value={create_company.COMPANY_ADD2}
                    onChange={handleCreate}
                    rows="3"
                    cols="50"
                  />
                </div>
              </div>
              <Button
                type="submit"
                variant="contained"
                className="btn text-white rounded-2 mt-2"
                onClick={handleSubmit}
              >
                Submit
              </Button>{" "}
              <Button
                variant="contained"
                color="error"
                onClick={handleClose}
                className="btn text-white rounded-2 mt-2"
              >
                Cancel
              </Button>
            </form>
          </Box>
        </Container>
      </Modal>

      <SimpleBackdrop open={loader} />
    </>
  );
};

export default CompanyCreate;




{/* <form className="p-4 overflow-auto">
//               <h5>Create company</h5>
//               <div className="row">
//                 <div className="form-group py-2 col-xl-6">
//                   <label>Company name</label>
//                   <input
//                     type="text"
//                     className={`form-control form-control-2 rounded-0 ${companynameError ? "is-invalid" : ""
//                       }`}
//                     placeholder="Enter company name"
//                     value={create_company.COMPANY_NAME}
//                     name="COMPANY_NAME"
//                     onChange={handleCreate}
//                     label=""
//                   />
//                   {companynameError && (
//                     <div className="invalid-feedback">{companynameError}</div>
//                   )}
//                 </div>
//                 {/* Username */}
//                 <div className="form-group py-2 col-xl-6">
//                   <label>Company Email</label>
//                   <input
//                     type="text"
//                     className={`form-control form-control-2 rounded-0 ${emailError ? "is-invalid" : ""
//                       }`}
//                     placeholder="Email address"
//                     value={create_company.COMPANY_USERNAME}
//                     name="COMPANY_USERNAME"
//                     onChange={handleCreate}
//                     label="Company Email"
//                   />

//                   {emailError && (
//                     <div className="invalid-feedback">{emailError}</div>
//                   )}
//                 </div>
//               </div>
//               <div className="row">
//                 {/* Phone Number */}
//                 <div className="form-group py-2 col-xl-6">
//                   <label>Phone Number</label>
//                   <input
//                     type="number"
//                     className={`form-control form-control-2 rounded-0 ${companyphoneError ? "is-invalid" : ""
//                       }`}
//                     placeholder="Enter Number"
//                     value={create_company.COMPANY_PHONE}
//                     name="COMPANY_PHONE"
//                     onChange={handleCreate}
//                     label="Phone Number"
//                   />
//                   {companyphoneError && (
//                     <div className="invalid-feedback">{companyphoneError}</div>
//                   )}

//                 </div>

//               </div>
//               <div className="row py-2">
//                 <div className="form-group col-xl-4">
//                   <label>Company Type</label>
//                   <select
//                     className="form-control form-control-2 border  rounded-0"
//                     name="COMPANY_ROLE"
//                     value={create_company.COMPANY_ROLE}
//                     onChange={handleCreate}
//                   >
//                     <option selected>Choose...</option>

//                     {list.map((e, key) => {
//                       return (
//                         <option value={e} key={key}>
//                           {e}
//                         </option>
//                       );
//                     })}
//                   </select>
//                 </div>


//                 <div className="form-group col-xl-4">
//                   <label>Subscription Type</label>
//                   <select
//                     className="form-control form-control-2 border rounded-0"
//                     name="COMPANY_SUBSCRIPTION"
//                     value={create_company.COMPANY_SUBSCRIPTION}
//                     onChange={handleCreate}
//                   >
//                     <option selected>--Select Subscription--</option>
//                     <option selected>Monthly</option>
//                     <option selected> Annual</option>
//                   </select>
//                 </div>

//                 <div className="form-group col-xl-4">
//                   <label>Company Status</label>
//                   <select
//                     className="form-control form-control-2 border rounded-0"
//                     name="COMPANY_STATUS"
//                     value={create_company.COMPANY_STATUS}
//                     onChange={handleCreate}
//                   >
//                     <option selected>--Select Status--</option>
//                     <option selected>Active</option>
//                     <option selected> Inactive</option>
//                   </select>
//                 </div>
//               </div>


//               <div className="row py-2">
//                 <div className="form-group col-xl-4">
//                   <label>Country</label>
//                   <select
//                     className="form-control form-control-2 border  rounded-0"
//                     name="COMPANY_COUNTRY"
//                     value={create_company.COMPANY_COUNTRY}
//                     onChange={handleCreate}
//                   >
//                     <option selected>--Choose Country--</option>

//                     {country.map((e, key) => {
//                       return (
//                         <option value={e.name} key={key}>
//                           {e.name}
//                         </option>
//                       );
//                     })}
//                   </select>
//                 </div>

//                 <div className="form-group col-xl-4">
//                   <label>State</label>
//                   <select
//                     className="form-control form-control-2 border  rounded-0"
//                     name="COMPANY_STATE"
//                     value={create_company.COMPANY_STATE}
//                     onChange={handleCreate}
//                   >
//                     <option>--Choose State--</option>
//                     {availableState?.states?.map((e, key) => {
//                       return (
//                         <option value={e.name} key={key}>
//                           {e.name}
//                         </option>
//                       );
//                     })}
//                   </select>
//                 </div>
//                 <div className="form-group col-xl-4">
//                   <label>City</label>
//                   <select
//                     className="form-control form-control-2 border rounded-0"
//                     name="COMPANY_CITY"
//                     value={create_company.COMPANY_CITY}
//                     onChange={handleCreate}
//                   >
//                     <option selected>--Choose City--</option>
//                     {availableCities?.cities?.map((e, key) => {
//                       return (
//                         <option value={e.name} key={key}>
//                           {e.name}
//                         </option>
//                       );
//                     })}
//                   </select>
//                 </div>
//               </div>
//               <div className="row py-2">
//                 <div className="form-group col-xl-12">
//                   <label>Address</label>
//                   <textarea
//                     type="text"
//                     className="form-control rounded-0"
//                     placeholder="Apartment, studio, or floor"
//                     name="COMPANY_ADD2"
//                     value={create_company.COMPANY_ADD2}
//                     onChange={handleCreate}
//                     rows="3"
//                     cols="50"
//                   />
//                 </div>
//               </div>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 className="btn text-white rounded-2 mt-2"
//                 onClick={handleSubmit}
//               >
//                 Submit
//               </Button>{" "}
//               <Button
//                 variant="contained"
//                 color="error"
//                 onClick={handleClose}
//                 className="btn text-white rounded-2 mt-2"
//               >
//                 Cancel
//               </Button>
//             </form> */}