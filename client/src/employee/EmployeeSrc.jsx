import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import EmployeeCreate from "./EmployeeCreate";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import teamImg1 from "../assests/images/team-1.jpg";
import { styled } from "@mui/material/styles";
// import Snackbar from "@mui/material/Snackbar";
import "../assests/css/employeesrc.css";
import { setRowsEmployee,setLoadingEmployee,setErrorEmployee} from "../redux/slice/getEmployee";
// import Cookies from "js-cookie";

import {
  Button,
  Paper,
  Skeleton,
} from "@mui/material";
import Snippet from "./Snippet";
import EmployeePDF from "../Invoices/EmployeePDF";
import { PDFViewer } from "@react-pdf/renderer";
import EmployeeTimeSheet from "./EmployeeTimeSheet";
import EmployeeEdit from "./EmployeeEdit";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import GenPassword from "./GenPassword";
import { toast } from "react-toastify";
import EmployeeAttendance from "./EmployeeAttendance";
import EmployeeManual from "./EmployeeManual";
import { useDispatch, useSelector } from "react-redux";
// import EmployeeManual from "./EmployeeManual";
// import { setRowsEmployee,setLoadingEmployee,setErrorEmployee} from "../redux/slice/getEmployee";
// import env from "react-dotenv";

const EmployeeSrc = (props) => {

  const employeeData = useSelector((state) =>  state.getEmployee);
  const companyData = useSelector((state) =>  state.companyLogin);
  const employeeDataState = employeeData.rows
  const projectData = useSelector((state) => state.getProject);

  const projectDataState = projectData.rows

  console.log(employeeData,"employee data redux");
  console.log(employeeData,"employee data redux");
  const dispatch = useDispatch();


  // const { id } = useParams();
  const param = companyData?.user?.split("&&");
  const COMPANY_ID = param[0];
  const COMPANY_USERNAME = param[1];
  const COMPANY_PARENT_ID = param[2];
  const COMPANY_PARENT_USERNAME = param[3];



  const [filterData, setFilteredData] = useState({
    row: {
      EMPLOYEE_DOB: "",
      EMPLOYEE_EMPLMNTTYPE: "",
      EMPLOYEE_HIRE_DATE: "",
      EMPLOYEE_HOURLY_WAGE: "",
      EMPLOYEE_ADD: "",
      EMPLOYEE_CITY: "",
      EMPLOYEE_PARENT_ID: "",
      EMPLOYEE_PARENT_USERNAME: "",
      EMPLOYEE_MEMBER_PARENT_ID: "",
      EMPLOYEE_MEMBER_PARENT_USERNAME: "",
      EMPLOYEE_ROLE: "",
      EMPLOYEE_NAME: "",
      EMPLOYEE_PHONE: "",
      EMPLOYEE_EMAIL: "",
      EMPLOYEE_USERNAME: "",
      EMPLOYEE_ID: "",
      EMPLOYEE_ASSIGN: [],
      __v: 0,
    },
  });

  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = useState(0);
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState([]);
  const [openNav, setOpenNav] = useState(false);




  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const fetchAllEmployee = async () => {
    try {
      const response = await axios.put(
        "/api/get_employee",
        {
          EMPLOYEE_PARENT_ID: COMPANY_ID,
          EMPLOYEE_PARENT_USERNAME: COMPANY_USERNAME,
          EMPLOYEE_MEMBER_PARENT_ID: COMPANY_PARENT_ID,
          EMPLOYEE_MEMBER_PARENT_USERNAME: COMPANY_PARENT_USERNAME,
        },

      );

      const data = response.data.result;
      dispatch(setRowsEmployee(data));
       console.log("PROJECT Data:=>", data);
     
    } catch (err) {
      dispatch(setErrorEmployee(err.message));
      console.log("Something Went Wrong: =>", err);
      throw err;
    }
    finally{
       dispatch(setLoadingEmployee(false));
    }
  };

  useEffect(()=> {
    fetchAllEmployee();
  })





  const columns = [
    { field: "EMPLOYEE_ID", headerName: "ID", width: 60 },
    {
      field: "EMPLOYEE_USERNAME",
      headerName: "Employee Email",
      width: 120,
      // editable: true,
    },
    {
      field: "EMPLOYEE_NAME",
      headerName: "Name",
      width: 120,
      // editable: true,
    },
    // {
    //   field: "EMPLOYEE_EMAIL",
    //   headerName: "E-mail",
    //   width: 120,
    //   // editable: true,
    // },
    {
      field: "EMPLOYEE_ROLE",
      headerName: "Employee Role",
      width: 120,
      // editable: true,
    },
    {
      field: "EMPLOYEE_PHONE",
      headerName: "Phone",
      width: 110,
      // editable: true,
    },
    {
      field: "EMPLOYEE_HIRE_DATE",
      headerName: "Hire Date",
      width: 100,
      // editable: true,
    },
    {
      field: "EMPLOYEE_HOURLY_WAGE",
      headerName: "Hourly Wages",
      width: 110,
      // editable: true,
    },

    {
      field: "EMPLOYEE_EMPLMNTTYPE",
      headerName: "Employement Type",
      width: 120,
      // editable: true,
    },
    {
      field: "action",
      headerName: "Action",
      width: 80,
      renderCell: (cellValues) => {
        return (
          <Button
            variant="contained"
            className="view-btn primary btn btn-success"
            style={{ padding: "2px 2px" }}
            onClick={(event) => {
              handleClick(cellValues);
            }}
          >
            view
          </Button>
        );
      },
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 80,
      renderCell: (cellValues) => {
        return (
          <Button>
            <EmployeeEdit edit={cellValues} refetch={employeeDataState} />
          </Button>
        );
      },
    },
  ];

  const columnsMobile = [
    { field: "EMPLOYEE_ID", headerName: "ID", width: 60 },
    {
      field: "EMPLOYEE_USERNAME",
      headerName: "Username",
      width: 120,
      // editable: true,
    },
    {
      field: "action",
      headerName: "Action",
      width: 80,
      renderCell: (cellValues) => {
        return (
          <Button
            variant="contained"
            className="view-btn primary btn btn-success"
            style={{ padding: "2px 2px" }}
            onClick={(event) => {
              handleClick(cellValues);
            }}
          >
            view
          </Button>
        );
      },
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 80,
      renderCell: (cellValues) => {
        return (
          <Button>
            <EmployeeEdit edit={cellValues} refetch={employeeDataState} />
          </Button>
        );
      },
    },
  ];

  function downloadPDF(pdf) {
    const linkSource = `data:application/pdf;base64,${pdf}`;
    const downloadLink = document.createElement("a");
    const fileName = "abc.pdf";
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  const handleClick = (event) => {
    setFilteredData(event);
    handleOpen();
  };

  const MyScreen = styled(Paper)((props) => ({
    height: "calc(100vh - 29px)",
    padding: 0,
    paddingBottom: "0",
    overflow: "auto",
    borderRadius: 0,
    Border: 0,
    display: props.screenIndex ? "block" : "none",
  }));

  const Animations = () => {
    return (
      <Box sx={{ width: "100%" }}>
        <Skeleton animation="pulse" height={60} />
        <Skeleton animation="pulse" height={50} />
        <Skeleton animation="pulse" height={50} />
        <Skeleton animation="pulse" height={50} />
        <Skeleton animation="pulse" height={50} />
        <Skeleton animation="pulse" height={50} />
        <Skeleton animation="pulse" height={50} />
        <Skeleton animation="pulse" height={50} />
      </Box>
    );
  };



  const handleAssignProject = (e) => {
    e.preventDefault();

    // Create a new object that combines the selected project data and employee data
    const mergedData = {
      PROJECT_ID: projectDataState.PROJECT_ID,
      PROJECT_PARENT_ID: projectDataState.PROJECT_PARENT_ID,
      PROJECT_MEMBER_PARENT_ID: projectDataState.PROJECT_MEMBER_PARENT_ID,
      PROJECT_MEMBER_PARENT_USERNAME:
        projectDataState.PROJECT_MEMBER_PARENT_USERNAME,
      PROJECT_USERNAME: projectDataState.PROJECT_USERNAME,
      EMPLOYEE_ID: employeeDataState.EMPLOYEE_ID,
      EMPLOYEE_PARENT_ID: employeeDataState.row.EMPLOYEE_PARENT_ID,
      EMPLOYEE_PARENT_USERNAME: employeeDataState.EMPLOYEE_PARENT_USERNAME,
      EMPLOYEE_MEMBER_PARENT_ID: employeeDataState.EMPLOYEE_MEMBER_PARENT_ID,
      EMPLOYEE_MEMBER_PARENT_USERNAME:
        employeeDataState.EMPLOYEE_MEMBER_PARENT_USERNAME,
    };

    // Validate the form data before submission

    axios
      .post("/api/assign_project", mergedData)
      .then((response) => {
        setSelectedProject(response.data.result);

        setIsSuccessMessageVisible(true);
        toast.success("Project Assign successfully!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
        });
        console.log(response.data.result.employee ,"response.data.result")
        if (response.data.result?.employee) {
          setFilteredData((event) => ({ ...event, row: response.data.result?.employee }))
        } else {
          toast.success("Project Already Assign", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
          });
        }
      })
      .catch((error) => {
        console.error(error, "ERR");
      });
  };



  const drawerWidth = 250;

  console.log(employeeDataState.EMPLOYEE_ASSIGN, "filterData.row")

  // const filterProjects =







  return (
    <>
      <Sidebar
        COMPANY_ID={COMPANY_ID}
        COMPANY_USERNAME={COMPANY_USERNAME}
        COMPANY_PARENT_ID={COMPANY_PARENT_ID}
        COMPANY_PARENT_USERNAME={COMPANY_PARENT_USERNAME}
        active={2}
        toggle={openNav}
      />
      <Box className="box" style={{ background: "#277099" }}>
        <Navbar toggle={() => setOpenNav((e) => !e)} name={COMPANY_USERNAME} />
        <EmployeeCreate
          COMPANY_ID={COMPANY_ID}
          COMPANY_USERNAME={COMPANY_USERNAME}
          COMPANY_PARENT_ID={COMPANY_PARENT_ID}
          COMPANY_PARENT_USERNAME={COMPANY_PARENT_USERNAME}
          name={"Employee"}
          refetch={employeeDataState}
        />

        <MyScreen sx={{ display: "block", padding: 3 }}>
          <Box style={{ height: "100%", padding: 0, paddingBottom: "0" }}>
          {employeeDataState.length === true ? (
              <Animations />
             
            ): (
              <>
                <DataGrid
                  className="display"
                  sx={{ border: "none" }}
                  rows={employeeDataState}
                  columns={columns}
                  getRowId={(row) => row.EMPLOYEE_ID}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 20,
                      },
                    },
                  }}
                  density="compact"
                  pageSizeOptions={[5]}
                  // checkboxSelection
                  disableRowSelectionOnClick
                />
              </>


            )} 
          </Box>
        </MyScreen>
      </Box>

      <Box
        style={{
          display: open ? "block" : "none",
        }}
        className="box position-absolute"
      >
        <Navbar toggle={() => setOpenNav((e) => !e)} name={COMPANY_USERNAME} />
        <div
          className="container-fluid pb-0 g-0"
          style={{ background: "#277099" }}
        >
          <Button
            onClick={handleClose}
            variant="contained"
            className="btn rounded-0 border-0"
            size="small"
          >
            <ArrowBackIcon style={{ fontSize: "22.5px" }} />
          </Button>
          {["Employee Details", "Attendance", "Timesheet"].map(
            (item, value) => (
              <Button
                onClick={(e, index) => setIndex(value)}
                variant={index === value ? "outlined" : "outlined"}
                className={
                  index === value
                    ? "btn button border-bottom-0 bg-white"
                    : "btn rounded-0 border-bottom-0  rounded-0 text-light"
                }
                size="small"
              >
                {item}
              </Button>
            )
          )}
        </div>

        <MyScreen screenIndex={index === 0} sx={{ padding: 3 }}>
          <div className="container mt-1">
            {/* <h1 className="text-center">Employee Detail Dashboard</h1> */}
            <div className="row">
              <div className="col-xl-6">
                <div className="row mt-2">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Employee Details</h5>
                        <table className="table" style={{ tableLayout: "" }}>
                          <tbody >
                            <GenPassword
                              EMPLOYEE_ID={filterData.row?.EMPLOYEE_ID}
                              EMPLOYEE_USERNAME={filterData.row?.EMPLOYEE_USERNAME} 
                              EMPLOYEE_PHONE={filterData.row?.EMPLOYEE_PHONE} 
                              ADMIN_ID={filterData.row?.EMPLOYEE_MEMBER_PARENT_ID}
                              ADMIN_USERNAME={filterData.row?.EMPLOYEE_MEMBER_PARENT_USERNAME}
                              />
                    
                            <tr>
                              <td><b>Username :</b></td>
                              <>
                                <td>
                                  {filterData.row?.EMPLOYEE_USERNAME}
                                </td>
                              </>
                            </tr>

                            <tr>
                              <td><b>Phone :</b></td>
                              <>
                                <td>
                                  {filterData.row?.EMPLOYEE_PHONE}
                                </td>
                              </>
                            </tr>

                            <tr>
                              <td><b>Address :</b></td>
                              <>
                                <td>
                                  {employeeDataState.EMPLOYEE_STATE ? employeeDataState?.EMPLOYEE_STATE : "Not Available"}{" "}
                                  {employeeDataState?.EMPLOYEE_CITY}
                                </td>
                              </>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 mt-2">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Work Details</h5>
                        <p className="card-text">
                          <strong>Role:</strong> {employeeDataState?.EMPLOYEE_ROLE}
                        </p>
                        <p className="card-text">
                          <strong>Employee type:</strong> {employeeDataState?.EMPLOYEE_EMPLMNTTYPE}
                        </p>
                        <p className="card-text">
                          <strong>Hire Date:</strong> {employeeDataState.EMPLOYEE_HIRE_DATE}
                        </p>
                        <p className="card-text">
                          <strong> Hourly Wages:</strong> {employeeDataState.EMPLOYEE_HOURLY_WAGE}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* <div className="col-12 mt-2">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Salary Information</h5>
                        <p className="card-text">Salary: $60,000 per year</p>
                        <p className="card-text">
                          Payment Type: Direct Deposit
                        </p>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
              <div className="col-xl-6">
                <div className="row">
                  <div className="col-xl-12 mt-2">
                    <div
                      className="card"
                      style={{ backgroundColor: "#f5f5f5" }}
                    >
                      <div className="card-body d-flex flex-column">
                        <h5 style={{ margin: "10px" }}>
                          Assigning Projects to{" "}
                          <span style={{ color: "tan" }}>
                            {employeeDataState?.EMPLOYEE_NAME}
                          </span>
                        </h5>
                        <div className="d-flex align-items-center" style={{ gap: 4 }}>
                        <select
                        className="form-select form-control-2"
                        value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
>
                       <option value="Select Project">Select Project</option>
                        {projectDataState.map((project) => (
                           <option key={project.PROJECT_ID} value={project.PROJECT_ID}>
                          {`${project.PROJECT_NAME}-${project.PROJECT_ID}`}
                                       </option>
                               ))}
                             </select>
s
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={handleAssignProject}
                          >
                            Assign Project
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 mt-2">
                    <div className="card">
                      <div className="card-body">
                        <h5>List of Projects Assigned to Employee:</h5>
                        <table className="table table-sm overflow-scroll">
                          <thead>
                            <tr>
                              <th scope="col">S.No</th>
                              <th scope="col">Project ID</th>
                              {/* <th scope="col">Project Name</th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {employeeDataState?.EMPLOYEE_ASSIGN?.map((project, index) => (
                              <tr key={project?.PROJECT_ID} >
                                <td style={{ backgroundColor: index % 2 === 0 ? "#f2f2f2" : "#fffff" }}>{index + 1}</td>
                                <td style={{ backgroundColor: index % 2 === 0 ? "#f2f2f2" : "#fffff" }}>{project?.PROJECT_ID}</td>
                                {/* <td style={{ backgroundColor: index % 2 === 0 ? "#f2f2f2" : "#fffff" }}>{project.PROJECT_NAME}</td> */}
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Add more salary-related details here */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MyScreen>

        {/* <MyScreen screenIndex={index === 1} sx={{ padding: 3 }}>
          <h5 style={{ textDecoration: "underline" }}>All Documents</h5>
          <div
            className="form-control form-control-2 rounded-0 mb-1"
            style={{ position: "relative" }}
          >
            Education Document
            <button
              style={{ position: "absolute", right: "0", top: "0" }}
              className="btn btn-primary rounded-0"
              onClick={() => downloadPDF(filterData.complianceDoc)}
            >
              Download file
            </button>
          </div>

          <div
            className="form-control form-control-2 rounded-0 mb-1"
            style={{ position: "relative" }}
          >
            Valid ID
            <button
              style={{ position: "absolute", right: "0", top: "0" }}
              className="btn btn-primary rounded-0"
              onClick={() => downloadPDF(filterData.complianceDoc)}
            >
              Download file
            </button>
          </div>
          <div
            className="form-control form-control-2 rounded-0 mb-1"
            style={{ position: "relative" }}
          >
            Other
            <button
              style={{ position: "absolute", right: "0", top: "0" }}
              className="btn btn-primary rounded-0"
              onClick={() => downloadPDF(filterData.complianceDoc)}
            >
              Download file
            </button>
          </div>
        </MyScreen> */}

        <MyScreen screenIndex={index === 1} sx={{ padding: 3 }}>
          <EmployeeManual
          EMPLOYEE_DATA={filterData?.row}
          />
        </MyScreen>

        <MyScreen screenIndex={index === 2} sx={{ padding: 3 }}>
          <EmployeeTimeSheet mainData={filterData.row} />
        </MyScreen>

        {/* <MyScreen
          screenIndex={index === 2}
          sx={{ padding: 3 }}
          className="rounded-0"
        >
          <Snippet />
        </MyScreen> */}

        {/* <MyScreen screenIndex={index === 3} sx={{ padding: "0" }}>
          <PDFViewer
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
            }}
          >
            <EmployeePDF
              name={filterData.row?.EMPLOYEE_NAME}
              email={filterData.row?.EMPLOYEE_EMAIL}
              phone={filterData.row?.EMPLOYEE_PHONE}
            />
          </PDFViewer>
        </MyScreen> */}
      </Box>
    </>
  );
};

export default EmployeeSrc;
