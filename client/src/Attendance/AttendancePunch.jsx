import React, { useEffect, useState } from "react";
import moment from "moment/moment";
const AttendancePunch = (props) => {
  // get all Project Id
  const Data = props.attendance?.map((e) => e.ATTENDANCE_PROJECT_ID);
  const [filter, setFilteredData] = useState(props.attendance);

  const TotalWorkHours = (ATTENDANCE_IN, ATTENDANCE_OUT) => {
    const attendanceIn = new Date(ATTENDANCE_IN);
    const attendanceOut = new Date(ATTENDANCE_OUT);
    const hoursWorked =
      Math.abs(attendanceOut - attendanceIn) / (1000 * 60 * 60); // Convert milliseconds to hours
    return hoursWorked.toFixed(2);
  };

  // handle project id
  const onHandleProjectId = (event) => {

    console.log(event, "eeeeeee");
    // filter data by Project Id
    if (event == "All" ) {
      setFilteredData(props.attendance);
    } else if((event != "All" )){
      const filterData = props.attendance?.filter(
        (e) => e.ATTENDANCE_PROJECT_ID == event
      )
      setFilteredData(filterData);
    }
    else {
      setFilteredData(props.attendance);
    }
    
    
  };

  // console.log(filter, "filter data");

  return (
    <>
      {props.attendance.length == 0 ? (
        "No record available for this week"
      ) : (
        <table className="table table-hover table-sm table-fixed table-responsive">
          <thead>
            <tr className="table-light">
              <th scope="col" colSpan={7} style={{ gap: 2 }}>
                <div className="btn btn-sm" disabled>
                  Project Id :{" "}
                  <select
                    onChange={(e) => onHandleProjectId(e.target.value)}
                  >
                    <option selected>All</option>

                    {Data.map((e) => (
                      <option>{e}</option>
                    ))}
                  </select>
                </div>{" "}
              </th>
            </tr>
            <tr className="table-light">
              <th scope="col">Employee Id</th>
              <th scope="col">Project Id</th>
              <th scope="col">Employee</th>
              <th scope="col">Date</th>
              <th scope="col">In</th>
              <th scope="col">Out</th>
              <th scope="col">Total Hours</th>
            </tr>
          </thead>
          <tbody>
            {filter?.map((post , index) => (
              <tr className="table table-striped" key={index}>
                <td>{props.data._doc.EMPLOYEE_ID}</td>
                <td>{post.ATTENDANCE_PROJECT_ID}</td>
                <td>{props.data._doc.EMPLOYEE_NAME}</td>
                <td>{post.ATTENDANCE_DATE_ID}</td>
                <td>{moment(post.ATTENDANCE_IN).format("LT")}</td>
                <td>{moment(post.ATTENDANCE_OUT).format("LT")}</td>
                <td>
                  {TotalWorkHours(post.ATTENDANCE_IN, post.ATTENDANCE_OUT)} h
                </td>
                {/* <td>{post.LOCATION}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default AttendancePunch;
