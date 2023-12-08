// News.js
import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Autocomplete,
  LoadScript,
  MarkerF,
  CircleF,
} from "@react-google-maps/api";
import {
  GOOGLE_MAPS_API_KEY,
  GOOGLE_MAPS_LIBRARIES,
} from "../components/Constants"; // Adjust the path accordingly
import axios from "axios";

const containerStyle = {
  width: "100%",
  height: "63vh",
};

const center = {
  lat: -33.8569,
  lng: 151.2152,
};

const ProjectLoc = (props) => {
  const editProjectData = props?.projectData;
  const [ProjectData, setProjectData] = useState([]);
  const [EditData, setEditData] = useState(false);
  const [autocomplete, setAutocomplete] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState([]);
  const [locationName, setLocationName] = useState("");
  const [circleCenter, setCircleCenter] = useState([0, 0]);
  const [circleRadius, setCircleRadius] = useState(500);
  const [isInsideCircle, setIsInsideCircle] = useState(false);
  const [map, setMap] = useState(null);
 

  const [markerPosition, setMarkerPosition] = useState({
    lat: 0,
    lng: 0,
  });
  const [errorMsg, setErrorMsg] = useState("");

  const [EditProject, setEditProject] = useState({
    LONGITUDE: "",
    LATITUDE: "",
    AREA: "",
    LOCATION_NAME: "",
  });

  
  // useEffect(() => {
  //   fetchProjects();
  // }, []);

  


  const headers = {
    "Content-Type": "application/json",
    authorization_key: "qzOUsBmZFgMDlwGtrgYypxUz",
  };

  const fetchProjects = async (e) => {
    try {
      const response = await axios.put(
        "/api/get_projects_one",
        {
          PROJECT_ID: editProjectData?.PROJECT_ID,
          PROJECT_MEMBER_PARENT_ID: editProjectData?.PROJECT_MEMBER_PARENT_ID,
          PROJECT_MEMBER_PARENT_USERNAME:
            editProjectData?.PROJECT_MEMBER_PARENT_USERNAME,
        },
        { headers }
      );
      setTimeout(() => {
      const data = response?.data;
      setProjectData(data?.result[0]);
      setMarkerPosition((prev) => ({
        ...prev,
        lat: parseFloat(data?.result[0]?.LATITUDE),
        lng: parseFloat(data?.result[0]?.LONGITUDE),
      }));
      setCircleRadius(parseInt(data?.result[0]?.AREA))
      setCircleCenter([parseFloat(data?.result[0]?.LATITUDE), parseFloat(data?.result[0]?.LONGITUDE)]);
      setLocationName(data?.result[0]?.LOCATION_NAME)
      

      // console.log("one Data : =>", data);
      }, 1000);
    } catch (err) {
      console.log("Something Went Wrong: =>", err);
    }
  };

  useEffect(() => {
    setEditProject((prev) => ({
      ...prev,
      LONGITUDE: markerPosition.lng,
      LATITUDE: markerPosition.lat,
      AREA: circleRadius,
      LOCATION_NAME: locationName,
    }));
  }, [markerPosition.lat, markerPosition.lng, circleRadius, locationName]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !EditProject.LONGITUDE ||
      !EditProject.LATITUDE ||
      !EditProject.AREA ||
      !EditProject.LOCATION_NAME
    ) {
      setErrorMsg("Fill all fields");
      // toast.error("Please fill in all fields", {
      //   position: toast.POSITION.TOP_CENTER,
      //   autoClose: 2000,
      // });
      return;
    }
    setErrorMsg("");

    axios
      .put(
        "/api/update_projects",
        {
          PROJECT_ID: editProjectData.PROJECT_ID,
          PROJECT_PARENT_ID: editProjectData.PROJECT_PARENT_ID,
          PROJECT_PARENT_USERNAME: editProjectData.PROJECT_PARENT_USERNAME,
          PROJECT_MEMBER_PARENT_ID: editProjectData.PROJECT_MEMBER_PARENT_ID,
          PROJECT_MEMBER_PARENT_USERNAME:
            editProjectData.PROJECT_MEMBER_PARENT_USERNAME,
          PROJECT_DETAILS_FOR_UPDATES: { ...EditProject },
        },
        {
          headers,
        }
      )
      .then((response) => {
        if (response.data.operation === "failed") {
          setErrorMsg(response.data.errorMsg);
        } else if (response.data.operation === "successfull") {
          // props.refetch();
          // console.log("anu", response)
          window.alert("success");
          setEditData(false)
        }
      })
      .catch((error) => {
        console.error(error, "ERR");
      });
  };

  // Get the user's current location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          fetchLocationName(currentPosition.lat, currentPosition.lng);
          setMarkerPosition(currentPosition);
          setCircleCenter([currentPosition.lat, currentPosition.lng]);
          if (map) {
            map.panTo(currentPosition);
          }
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  };

  useEffect(() => {
    getLocation();
  }, []);
   // Run only once when component mounts

  const fetchLocationName = async (lat, lon) => {
    // fatch locatin name
    try {

      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${GOOGLE_MAPS_API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();
      const address = data?.results[0]?.formatted_address;
      setLocationName(address);
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  const handlePlaceSelect = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();

      if (!place.geometry) {
        console.log("No geometry for this place:", place);
        return;
      }

      setSelectedPlace(place);

      if (map) {
        const position = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setMarkerPosition(position);
        fetchLocationName(position.lat, position.lng);
        setCircleCenter(position.lat, position.lng);
        map.panTo(position);
      }
    }
  };

  const onLoad = (map) => {
    setMap(map);
  };

  // console.log(locationName, "location");
  // console.log(markerPosition, "markerPosition");

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371e3; // Earth's radius in meters
    const phi1 = toRad(lat1);
    const phi2 = toRad(lat2);
    const deltaPhi = toRad(lat2 - lat1);
    const deltaLambda = toRad(lon2 - lon1);

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) *
        Math.cos(phi2) *
        Math.sin(deltaLambda / 2) *
        Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  };

  const handleCircleRadiusChange = (event) => {
    const radius = parseFloat(event.target.value);
    if (!isNaN(radius) && radius >= 0) {
      setCircleRadius(radius);
    }
  };

  // console.log(circleCenter, "circleCenter");

  useEffect(() => {
    if (
      // markerPosition2.lat,
      // markerPosition2.lng,
      circleCenter[0] &&
      circleCenter[1]
    ) {
      const distanceFromCircleCenter = calculateDistance(
        // markerPosition2.lat,
        // markerPosition2.lng,
        circleCenter[0],
        circleCenter[1]
      );

      setIsInsideCircle(distanceFromCircleCenter <= circleRadius);
    }
  }, [circleCenter, circleRadius]);

  console.log(markerPosition,circleRadius, "markerPosition");

  return (
    <div>
      <LoadScript
        googleMapsApiKey={GOOGLE_MAPS_API_KEY}
        libraries={GOOGLE_MAPS_LIBRARIES}
      >
        <table className="table table-bordered table-fixed table-sm">
          <colgroup>
            <col style={{ width: "20%" }} />
            <col style={{ width: "30%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "30%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>Property</th>
              <th>Value</th>
              <th>Property</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {markerPosition?.lat && markerPosition?.lng && (
              <tr>
                <td>Project lat</td>
                <td>{markerPosition?.lat}</td>
                <td>Project lng</td>
                <td>{markerPosition?.lng}</td>
              </tr>
            )}
            {locationName && (
              <tr>
                <td>Location Name</td>
                <td colSpan="3">{locationName}</td>
              </tr>
            )}

            {markerPosition?.lat &&
              markerPosition?.lng &&
              circleCenter[0] &&
              circleCenter[1] && (
                <tr>
                  <td>Circle Radius (in meters)</td>
                  <td>

                    {EditData ? <input
                      type="text"
                      value={circleRadius}
                      onChange={handleCircleRadiusChange}
                      className="form-control form-control-2"
                    /> : <b>{ProjectData && ProjectData?.AREA}</b> }
                  </td>
                  <td>Your location is</td>
                  <td>{isInsideCircle ? "inside" : "outside"} the circle.</td>
                </tr>
              )}
            <tr>
              <td>Enter Location</td>
              <td>
                {EditData && <Autocomplete
                  onLoad={(auto) => setAutocomplete(auto)}
                  onPlaceChanged={handlePlaceSelect}
                >
                  <input
                    type="text"
                    placeholder="Search for a place"
                    className="form-control"
                  />
                </Autocomplete>}
              </td>
              <td>Get Current Location</td>
              <td>
                {EditData && <button
                  className="btn btn-primary btn-sm"
                  onClick={getLocation}
                >
                  Get Current Location
                </button> }{" "}
                {EditData ? (
                  <>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={handleSubmit}
                    >
                      Save
                    </button>{" "}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setEditData(false)}
                    >
                      Discard
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setEditData(true)}
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: "10px" }}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={markerPosition || center} // Use markerPosition if available, else use center
              zoom={markerPosition ? 13 : 10} // Zoom in when markerPosition is available
              onLoad={onLoad}
            >
              {markerPosition && <MarkerF position={markerPosition} />}
              {/* {markerPosition2 && <MarkerF position={markerPosition2} />} */}

              <CircleF
                center={markerPosition}
                radius={circleRadius}
                options={{
                  fillColor: "#FF0000",
                  fillOpacity: 0.2,
                  strokeColor: "#FF0000",
                  strokeOpacity: 1,
                  strokeWeight: 1,
                }}
              />
            </GoogleMap>

        </div>
      </LoadScript>
    </div>
  );
};

export default ProjectLoc;