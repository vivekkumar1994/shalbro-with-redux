import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import styled from 'styled-components';
import { Paper, Button, Modal, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import VehicleForm from '../assetmanage/VehicleForm';
import './vehicle.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VehicleTrackingSystem from "./TrackVehicle";
// import { styled } from "@mui/material/styles";


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
const FileInput = styled("input")({
  display: "none",
});
const FileInputLabel = styled("label")({
  display: "block",
  width: "100%",
  padding: "10px 15px",
  background: "#277099",
  color: "#fff",
  textAlign: "center",
  borderRadius: "4px",
  cursor: "pointer",
  transition: "background 0.3s, color 0.3s",
  "&:hover": {
    background: "#1a5c83",
  },
});


const Vehicle = () => {
  const [open, setOpen] = useState(false);
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [createVehicle, setCreateVehicle] = useState({
    vehicleName: "",
    vehicleNumber: "",
    licenseFile: null,
    pollutionFile: null,
  });
  const [trackButtonClicked, setTrackButtonClicked] = useState(false);
  const [activeButton, setActiveButton] = useState("VehicleList");
  const [errorMsg, setErrorMsg] = useState("");
  const [currentScreen, setCurrentScreen] = useState("VehicleList"); // Default screen
  const [index, setIndex] = useState(1);
  const handleScreenChange = (screen) => {
    setCurrentScreen(screen);
  };


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleTrackingOpen = () => {
    setTrackingOpen(true);
  };

  const handleTrackingClose = () => {
    setTrackingOpen(false);
  };

  const MyScreen = styled(Paper)((props) => ({
    height: 'calc(100vh - 32px)',
    padding: 0,
    paddingBottom: '0',
    overflow: 'auto',
    borderRadius: 0,
    Border: 0,
    display: props.screenIndex ? 'block' : 'none',
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = [
      "vehicleName",
      "vehicleNumber",
      "licenseFile",
      "pollutionFile",
    ];

    const hasEmptyFields = requiredFields.some(
      (field) => !createVehicle[field]
    );

    if (hasEmptyFields) {
      setErrorMsg("Fill all fields");
      toast.error("Please fill in all fields", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
      return;
    }

    setErrorMsg("");

    // Handle Axios POST request
    // ...

    // Close the modal and reset the form
    handleClose();
  };


  const trackingColumns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'vehicleName', headerName: 'Vehicle Name', width: 150 },
    { field: 'latitude', headerName: 'Latitude', width: 150 },
    { field: 'longitude', headerName: 'Longitude', width: 150 },
    { field: 'status', headerName: 'Status', width: 150 },
  ];
  const trackedVehicles = [
    {
      id: 1,
      vehicleName: 'Vehicle 1',
      latitude: 34.0522,
      longitude: -118.2437,
      status: 'Active',
    },
    {
      id: 2,
      vehicleName: 'Vehicle 2',
      latitude: 40.7128,
      longitude: -74.0060,
      status: 'Idle',
    },
    // Add more tracked vehicles
  ];



  const handleCreate = (e) => {
    const { name, value } = e.target;
    setCreateVehicle((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    setCreateVehicle((prevState) => ({
      ...prevState,
      [fileType]: file,
    }));
  };


  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'vehicleName',
      headerName: 'Vehicle Name',
      width: 150,
      editable: true,
    },
    {
      field: 'vehicleNumber',
      headerName: 'Vehicle Number',
      width: 150,
      editable: true,
    },
    {
      field: 'licenseFile',
      headerName: 'License File',
      className: "view-btn primary btn btn-success button",
      width: 150,
      renderCell: (params) => (
      
          <Button
          className="view-btn primary btn btn-success button"
          variant="outlined"
          onClick={() => handleDownload(params.row.licenseFile)}
        >
          License
          </Button>
      ),
    },
    {
      field: 'pollutionFile',
      headerName: 'Pollution File',
      width: 150,
      renderCell: (params) => (
        <Button
          className="view-btn  button"
          variant="outlined"
          onClick={() => handleDownload(params.row.pollutionFile)}
        >
          Pollution
        </Button>
      ),
    },
  ];

  const rows = [
    // Replace the placeholder data with actual data
    { id: 1, vehicleName: 'Vehicle 1', vehicleNumber: '123', licenseFile: 'license.pdf', pollutionFile: 'pollution.pdf' },
    { id: 2, vehicleName: 'Vehicle 2', vehicleNumber: '456', licenseFile: 'license.pdf', pollutionFile: 'pollution.pdf' },
    { id: 2, vehicleName: 'Vehicle 2', vehicleNumber: '456', licenseFile: 'license.pdf', pollutionFile: 'pollution.pdf' },
    { id: 2, vehicleName: 'Vehicle 2', vehicleNumber: '456', licenseFile: 'license.pdf', pollutionFile: 'pollution.pdf' },
    { id: 2, vehicleName: 'Vehicle 2', vehicleNumber: '456', licenseFile: 'license.pdf', pollutionFile: 'pollution.pdf' },
    { id: 2, vehicleName: 'Vehicle 2', vehicleNumber: '456', licenseFile: 'license.pdf', pollutionFile: 'pollution.pdf' },
    // Add more rows
  ];

  console.log(index, "index")



  const handleDownload = (filename) => {
    // Implement your download logic here using the filename
    // For example, trigger a download from a specific URL
    window.open(`http://example.com/downloads/${filename}`, '_blank');
  };

  return (
    <>
      <Box className="box" style={{ background: '#277099' }}>
       
        <Button
          onClick={(e) => setIndex(1)}
          className={
            index === 1
              ? "btn button border-bottom-0 bg-white"
              : "btn rounded-0 border-0  rounded-0 text-light"
          }
          size="small"

          variant={index === 1 ? "outlined" : "outlined"}
        >
          Vehicle
        </Button>
        <Button
          onClick={(e) => setIndex(2)}
      
          className={
            index === 2
              ? "btn button border-bottom-0 bg-white"
              : "btn rounded-0 border-0  rounded-0 text-light"
          }
          size="small"

          variant={index === 2 ? "outlined" : "outlined"}
        >
          Track Vehicles
        </Button>
        <VehicleForm name={'Project'} />




        <MyScreen screenIndex={index === 1} sx={{ padding: 3 }}>
     
          <Box sx={{ height: 400, width: '100%' }}>

            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              density="compact"
              pageSizeOptions={[5]}
              checkboxSelection
              disableRowSelectionOnClick
            />


          </Box>
       
        </MyScreen>
        <MyScreen screenIndex={index === 2} sx={{ padding: 3 }}>
        <VehicleTrackingSystem />
        </MyScreen>
      </Box>

     
      

    </>
  );
};

export default Vehicle;
