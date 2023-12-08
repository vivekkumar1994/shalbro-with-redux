import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { setRowsProject,setLoadingProject,setErrorProject } from "../redux/slice/getProjectSlice";
import { MyContext } from "../context/Mycontext";
import ProjectEdit from "./ProjectEdit";
import ProjectLoc from "./ProjectLoc";
import ProjectCreate from "./ProjectCreate"
import ProjectAssigned from "./ProjectAssigned";
import { useDispatch } from "react-redux";
// import { setRowsCompany,setLoadingCompany,setErrorCompany } from "../redux/slice/getAllCompany";
// import { setRowsProject,setLoadingProject,setErrorProject } from "../redux/slice/getProjectSlice";
import {
  Avatar,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Skeleton,
  Toolbar,
  Tooltip,
  styled,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
// import { useDispatch, useSelector } from "react-redux";
// import { initProject_fun } from "../redux/action";

const Project = (props) => {

  const companyData = useSelector((state) => state.companyLogin);
  const projectData = useSelector((state) => state.getProject);

  const projectDataState = projectData.rows
  console.log("projectDatafromstate",projectDataState);
 const dispatch = useDispatch();


  // const { id } = useParams();
  
  const param = companyData?.user.split("&&");
  const COMPANY_ID = param[0];
  const COMPANY_USERNAME = param[1];
  const COMPANY_PARENT_ID = param[2];
  const COMPANY_PARENT_USERNAME = param[3];
 
  console.log("alldetail",COMPANY_PARENT_ID,COMPANY_PARENT_USERNAME,COMPANY_ID,COMPANY_USERNAME);
 
  const fetchAllProjects = async () => {
    try {
      dispatch(setLoadingProject(true));
      const response = await axios.put(
        "/api/get_projects",
        {
                  PROJECT_PARENT_ID: COMPANY_ID,
                  PROJECT_PARENT_USERNAME: COMPANY_USERNAME,
                  PROJECT_MEMBER_PARENT_ID: COMPANY_PARENT_ID,
                  PROJECT_MEMBER_PARENT_USERNAME: COMPANY_PARENT_USERNAME,
        }
      );

      const data = response.data.result;
      dispatch(setRowsProject(data));
       console.log("PROJECT Data:=>", data);
     
    } catch (err) {
      dispatch(setErrorProject(err.message));
      console.log("Something Went Wrong: =>", err);
      throw err;
    }
    finally{
       dispatch(setLoadingProject(false));
    }
    
  };
  // console.log(id);

  useEffect(()=> {
   fetchAllProjects()
  },[dispatch])



    
 
  // const { id } = useParams();

  // const param = id.split("&");
  // const COMPANY_ID = param[0];
  // const COMPANY_USERNAME = param[1];
  // const COMPANY_PARENT_ID = param[2];
  // const COMPANY_PARENT_USERNAME = param[3];

  const [data, setData] = useState({
    row: {
      PROJECT_ID: "",
      PROJECT_PARENT_ID: "",
      PROJECT_PARENT_USERNAME: "",
      PROJECT_MEMBER_PARENT_ID: "",
      PROJECT_MEMBER_PARENT_USERNAME: "",
      PROJECT_TYPE: "",
      PROJECT_NAME: "",
      PROJECT_ACCOUNT: "",
      PROJECT_USERNAME: "",
      PROJECT_START_DATE: "",
      PROJECT_END_DATE: "",
      PROJECT_SUPERVISOR: "",
      PROJECT_PROGRESS: "",
      PROJECT_ADD: "",
      PROJECT_VALUE: "",
      PROJECT_COUNTRY: "",
      PROJECT_STATE: "",
      PROJECT_CITY: "",
      PROJECT_CURRENCY: "",
    },
  });
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(1);
  const [ProjectData, setProjectData] = useState([]);
  const [Edit, setEdit] = useState(false);
  const [openNav, setOpenNav] = useState(false);
  const [updatedata, setUpdateData] = useState(false);
  console.log("hgsvdcv", ProjectData);

  // modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);



  const columns = [
    { field: "PROJECT_ID", headerName: "ID", width: 60 },
    {
      field: "PROJECT_USERNAME",
      headerName: "Username",
      width: 120,
    },
    {
      field: "PROJECT_NAME",
      headerName: "Name",
      width: 120,
    },
    {
      field: "PROJECT_ACCOUNT",
      headerName: "Account",
      width: 130,
    },
    {
      field: "PROJECT_START_DATE",
      headerName: "Start Date",
      width: 100,
    },
    {
      field: "PROJECT_END_DATE",
      headerName: "End Date",
      type: "number",
      width: 100,
    },

    {
      field: "PROJECT_SUPERVISOR",
      headerName: "Supervisor",
      width: 150,
    },

    {
      field: "PROJECT_VALUE",
      headerName: "Project Value",
      width: 120,
      renderCell: (cellValues) => {
        return (
          <span>
            {cellValues.row.PROJECT_VALUE} {cellValues.row.PROJECT_CURRENCY}
          </span>
        );
      },
    },

    {
      field: "PROJECT_TYPE",
      headerName: "Project Type",
      width: 140,
    },

    {
      field: "action",
      headerName: "Detail",
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
          <Button
          // onClick={(event) => {
          //   handleEdit(cellValues);
          // }}
          >
            <ProjectEdit edit={cellValues} 
            refetch={projectDataState} 
            
            />
          </Button>
        );
      },
    },
  ];

  const columnsMobile = [
    { field: "PROJECT_ID", headerName: "ID", width: 60 },
    {
      field: "PROJECT_NAME",
      headerName: "Name",
      width: 120,
    },
    {
      field: "action",
      headerName: "Detail",
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
          <Button
          // onClick={(event) => {
          //   handleEdit(cellValues);
          // }}
          >
            <ProjectEdit edit={cellValues} refetch={projectDataState} />
          </Button>
        );
      },
    },
  ];

  // const rows = ProjectData;
  // console.log("Project Data : 1=>", rows);

  const handleClick = (event) => {
    setData(event);
    // dispatch(initProject_fun(event))
    handleOpen();
  };

  const filterData = data.row;
  console.log("fillterdata ha",filterData);

  const MyScreen = styled(Paper)((props) => ({
    height: "calc(100vh - 29px)",
    padding: 0,
    background: "#fff",
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

  const drawerWidth = 250;

  // console.log(projectData, "filterallprojectData");

  return (
    <>
      <Sidebar
        COMPANY_ID={COMPANY_ID}
        COMPANY_USERNAME={COMPANY_USERNAME}
        COMPANY_PARENT_ID={COMPANY_PARENT_ID}
        COMPANY_PARENT_USERNAME={COMPANY_PARENT_USERNAME}
        active={1}
        toggle={openNav}
      />

      <Box className="box" style={{ background: "#277099" }}>
        <Navbar toggle={() => setOpenNav((e) => !e)} name={COMPANY_USERNAME} />
        <ProjectCreate
          COMPANY_ID={COMPANY_ID}
          COMPANY_USERNAME={COMPANY_USERNAME}
          COMPANY_PARENT_ID={COMPANY_PARENT_ID}
          COMPANY_PARENT_USERNAME={COMPANY_PARENT_USERNAME}
          Update={projectDataState}
          name={"Project"}
        />
        <MyScreen sx={{ display: "block", padding: 3 }}>
          <Box style={{ height: "100%", padding: 0, paddingBottom: "0" }}>
            {projectDataState.length === 0  ? (
              <Animations />
             
            ) : ( 
           
              <>
                  <DataGrid
                    sx={{ border: "none" }}
                    rows={projectDataState}
                    columns={columns}
                    getRowId={(row) => row?.PROJECT_ID}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 20,
                        },
                      },
                    }}
                    density="compact"
                    pageSizeOptions={[5]}
                    checkboxSelection={false}
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
          height: "100vh",
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
            className="btn rounded-0"
            size="small"
          >
            <ArrowBackIcon style={{ fontSize: "20px" }} />
          </Button>
          <Button
            onClick={(e) => setIndex(1)}
            variant={index === 1 ? "outlined" : "outlined"}
            className={
              index === 1
                ? "btn button border-bottom-0 bg-white"
                : "btn rounded-0 border-bottom-0  rounded-0 text-light"
            }
            size="small"
          >
            Detail
          </Button>

          <Button
            onClick={(e) => setIndex(2)}
            variant={index === 2 ? "outlined" : "outlined"}
            className={
              index === 2
                ? "btn button border-bottom-0 bg-white"
                : "btn rounded-0 border-0  rounded-0 text-light"
            }
            size="small"
          >
            Allocate Employees
          </Button>
          <Button
            onClick={(e) => setIndex(3)}
            variant={index === 3 ? "outlined" : "outlined"}
            className={
              index === 3
                ? "btn button border-bottom-0 bg-white"
                : "btn rounded-0 border-0  rounded-0 text-light"
            }
            size="small"
          >
            Track
          </Button>
        </div>

        <MyScreen screenIndex={index === 1} sx={{ padding: 3 }}>
          <div className="container-fluid g-0">
            <div className="row">
              <div className="col-md-2">
                <b>Project Name</b>
                <p className="bg-light text-dark p-2 rounded-2">
                  {filterData.PROJECT_NAME}
                </p>
              </div>
              <div className="col-md-2">
                <b>Account</b>
                <p className="bg-light text-dark p-2 rounded-2">
                  {filterData?.PROJECT_ACCOUNT}
                </p>
              </div>
              <div className="col-md-2">
                <b>Username</b>
                <p className="bg-light text-dark p-2 rounded-2">
                  {filterData?.PROJECT_USERNAME}
                </p>
              </div>
              <div className="col-md-2">
                <b>Supervisor</b>
                <p className="bg-light text-dark p-2 rounded-2">
                  {filterData?.PROJECT_SUPERVISOR}
                </p>
              </div>
              <div className="col-2">
                <b>Project Value</b>
                <p className="bg-light text-dark p-2 rounded-2">
                  {`${projectData?.PROJECT_VALUE} ${filterData?.PROJECT_CURRENCY}`}
                </p>
              </div>
              <div className="col-2">
                <b>Employement Type</b>
                <p className="bg-light text-dark p-2 rounded-2">
                  {projectData?.PROJECT_TYPE}
                </p>
              </div>
              <div className="col-2">
                <b>Country</b>
                <p className="bg-light text-dark p-2 rounded-2">
                  {projectData?.PROJECT_COUNTRY}
                </p>
              </div>
              <div className="col-2">
                <b>State</b>
                <p className="bg-light text-dark p-2 rounded-2">
                  {filterData?.PROJECT_STATE}
                </p>
              </div>
              <div className="col-2">
                <b>City</b>
                <p className="bg-light text-dark p-2 rounded-2">
                  {filterData?.PROJECT_CITY}
                </p>
              </div>

              <div className="col-4">
                <b>Location</b>
                <p className="bg-light text-dark p-2 rounded-2">
                  {filterData?.PROJECT_ADD}
                </p>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col">
                <b>Project Role</b>
                <p className="bg-light text-dark p-2 rounded-2">
                  {filterData?.PROJECT_ROLE
                    ? filterData?.PROJECT_ROLE
                    : "not mentioned !"}
                </p>
              </div>
              <div className="col">
                <b>Project Status</b>
                <p className="bg-success text-dark p-2 rounded-2">
                  In Execution
                </p>
              </div>
              <div className="col">
                <b>Project Start</b>
                <p className="bg-light text-dark p-2 rounded-2">
                  {filterData?.PROJECT_START_DATE}
                </p>
              </div>
              <div className="col">
                <b>Project End</b>
                {Edit ? (
                  <input
                    type="date"
                    value={filterData?.PROJECT_END_DATE}
                    className="form-control"
                  />
                ) : (
                  <p className="bg-light text-dark p-2 rounded-2">
                    {filterData?.PROJECT_END_DATE}
                  </p>
                )}
              </div>
            </div>

            <div className="row">
              <div className="col-4">
                <b>Project Progress</b>
                <div className="p-2 rounded-3 bg-light">
                  <div
                    className="progress-bar"
                    style={{
                      background: `radial-gradient(closest-side, white 79%, transparent 80% 100%),conic-gradient(hotpink ${filterData?.PROJECT_PROGRESS}%, pink 0)`,
                    }}
                  >
                    <div className="counter">
                      {filterData?.PROJECT_PROGRESS}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MyScreen>

        <MyScreen screenIndex={index === 2} sx={{ padding: 3 }}>
          <ProjectAssigned projectData={filterData} />
        </MyScreen>

        <MyScreen screenIndex={index === 3} sx={{ padding: 3 }}>
          {index === 3 && <ProjectLoc projectData={filterData} />}
        </MyScreen>
      </Box>
    </>
  );
};

export default Project;
