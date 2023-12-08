import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { setUser, setError, setLoading } from '../redux/slice/companyLogin';

import InputControl from "./InputControl";
import { auth } from "../firebase";

import styles from "../assests/css/Login.module.css";
import { Alert, Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

function Logincomp({message}) {
  const dispatch = useDispatch();
  const { user, error, loading } = useSelector((state) => state.companyLogin);
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    pass: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  // const [loadings, setLoading] = useState(false);
  const [showpassword, setShowpassword] = useState(true)


  console.log()

  useEffect(()=>{
    
    setErrorMsg(message);
  },[message])

  const handleSubmission = () => {
    if (!values.email || !values.pass) {
      setErrorMsg("Please fill all fields");
      return;
    }

    setErrorMsg("");
    setSubmitButtonDisabled(true);
    dispatch(setLoading(true));

    signInWithEmailAndPassword(auth, values.email, values.pass)
      .then(async (res) => {
        setSubmitButtonDisabled(false);
        dispatch(setLoading(false));

        const data = res.user.displayName;
        const param = data.split("&&");

        if (param[4] === "company") {
          dispatch(setUser(data));
          navigate(`/company`, { state: data });
        } else {
          navigate("/");
          dispatch(setError("Company: Error (auth/invalid-login-credentials)."));
        }
      })
      .catch((err) => {
        setSubmitButtonDisabled(false);
        dispatch(setLoading(false));
        console.error("Authentication error:", err);
        setErrorMsg(err.message);
        dispatch(setError(err.message));
      });
  };
  
  return (
    <>
      {/* <div className={styles.innerBox}> */}
        <h5 className={styles.heading}>Shalbro Constructions</h5>
        <h5 className="text-center">Login(Company)</h5>

        <InputControl
          label="Email"
          onChange={(event) =>
            setValues((prev) => ({ ...prev, email: event.target.value }))
          }
          placeholder="Enter email address"
        />

        <span style={{ position: "relative" }} className="mb-3">
          <InputControl
            label="Password"
            type={showpassword ? "password" : "text"}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, pass: event.target.value }))
            }
            placeholder="Enter Password"
          />
          <span style={{ position: "absolute", right: "10px", top: "50%" }}>
            <i className={showpassword ? "fa fa-eye-slash" : "fa fa-eye"} onClick={() => setShowpassword(e => !e)}></i></span>

        </span>

        {errorMsg && (
            <>
              <Stack sx={{ width: '100%' }} spacing={2} pt={1}>
                <Alert severity="error">{errorMsg}</Alert>
              </Stack>
            </>

          )}
        
       
        {/* <br /> */}
        <div className={styles.footer}>
          <button disabled={submitButtonDisabled} onClick={handleSubmission}>
            {loading ? "loading..." : "Login"}
          </button>
        </div>

      {/* </div> */}
    </>
  );
}

export default Logincomp;
