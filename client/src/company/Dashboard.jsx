import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useLocation , useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setRowsProject,setLoadingProject,setErrorProject } from "../redux/slice/getProjectSlice";
import { setRowsEmployee,setLoadingEmployee,setErrorEmployee} from "../redux/slice/getEmployee";
import { setRowsAttendance,setLoadingAttendance,setErrorAttendance} from "../redux/slice/getAttendance";
import { setRowsDocumentC,setLoadingDocumentC,setErrorDocumentC} from "../redux/slice/getDocumentC";
import { setRowsSubcontractor,setLoadingSubcontractor,setErrorSubcontractor} from "../redux/slice/getSubcontractor";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

// const navigate = useNavigate();

export default function CompanyDashboard(props) {
  


  const companyData = useSelector((state) => state.companyLogin);
  const projectData = useSelector((state) => state.getProject);
  const employeeData = useSelector((state)=> state.getEmployee);
const attendanceData = useSelector((state)=> state.getAttendance)
const attendanceDataState = attendanceData.rows;
console.log("attendanceStatedata",attendanceDataState);

  const projectDataState = projectData.rows
  console.log("projectDatafromstate",projectDataState);
 const dispatch = useDispatch();


  // const { id } = useParams();
  
  const param = companyData?.user.split("&&");
  const COMPANY_ID = param[0];
  const COMPANY_USERNAME = param[1];
  const COMPANY_PARENT_ID = param[2];
  const COMPANY_PARENT_USERNAME = param[3];
  const [open,setOpen] = useState(false)

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

  const fetchAllAttendance = async () => {
    try {
      const response = await axios.put(
        "/api/get_employee_details_for_attendence",
        {
          ADMIN_USERNAME: COMPANY_PARENT_USERNAME,
          EMPLOYEE_PARENT_USERNAME: COMPANY_USERNAME,
        },

      );

      const data = response.data.result;
      dispatch(setRowsAttendance(data));
       console.log("PROJECT Data:=>", data);
     
    } catch (err) {
      dispatch(setErrorAttendance(err.message));
      console.log("Something Went Wrong: =>", err);
      throw err;
    }
    finally{
       dispatch(setLoadingAttendance(false));
    }
  };

  const fetchAllDocumentC = async () => {
    try {
      const response = await axios.put(
        "/api/get_all_document",
        {
          DOCUMENT_REF_ID: COMPANY_ID,
          DOCUMENT_ADMIN_USERNAME: COMPANY_PARENT_USERNAME,
        },

      );

      const data = response.data.result;
      dispatch(setRowsDocumentC(data));
       console.log("PROJECT Data:=>", data);
     
    } catch (err) {
      dispatch(setErrorDocumentC(err.message));
      console.log("Something Went Wrong: =>", err);
      throw err;
    }
    finally{
       dispatch(setLoadingDocumentC(false));
    }
  };
  const fetchAllSubcontractor = async () => {
    try {
      const response = await axios.put(
        "/api/get_subcontractor",
        {
  
          SUBCONTRACTOR_PARENT_ID: COMPANY_ID,
          SUBCONTRACTOR_PARENT_USERNAME: COMPANY_USERNAME,
          SUBCONTRACTOR_MEMBER_PARENT_ID: COMPANY_PARENT_ID,
          SUBCONTRACTOR_MEMBER_PARENT_USERNAME: COMPANY_PARENT_USERNAME,
        

        },

      );

      const data = response.data.result;
      dispatch(setRowsSubcontractor(data));
       console.log("PROJECT Data:=>", data);
     
    } catch (err) {
      dispatch(setErrorSubcontractor(err.message));
      console.log("Something Went Wrong: =>", err);
      throw err;
    }
    finally{
       dispatch(setLoadingSubcontractor(false));
    }
  };




  // Call the fetchData function to fetch both sets of data concurrently
  //update data

  useEffect(() => {
    fetchAllProjects();
    fetchAllEmployee();
    fetchAllAttendance()
    fetchAllDocumentC()
    fetchAllSubcontractor()
  }, [dispatch]);




  return (
    <>
      <Sidebar
        COMPANY_ID={COMPANY_ID}
        COMPANY_USERNAME={COMPANY_USERNAME}
        COMPANY_PARENT_ID={COMPANY_PARENT_ID}
        COMPANY_PARENT_USERNAME={COMPANY_PARENT_USERNAME}
        active={0}
        toggle={open}
      />

      <Navbar toggle={() => setOpen((e) => !e)} />
    </>
  );
}
