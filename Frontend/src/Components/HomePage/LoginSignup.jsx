import React, { useState, useEffect } from "react";
import "../style.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { GoogleLogin,GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
/*  Importing all the Images  */
import email from "../Assets/email.png";
import password from "../Assets/password.png";
import person from "../Assets/person.png";
import sigin from "../Assets/signin.svg";
import login from "../Assets/login.png";

const LoginSignup = (props) => {
  const [action, setAction] = useState("Login");
  const [userOTP, setOTP] = useState("");
  const [userMail, setEmailValue] = useState("");
  const [userPassword, setPasswordValue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = props.pageTitle;
  }, [props.pageTitle]);

  const handleSignUp = async () => {
    if (!userMail || !userPassword || !userOTP) {
      return;
    }
    const data = {
      userMail: userMail,
      userPassword: userPassword,
      userType: "USER",
      userOTP: userOTP,
    };

    const url = "https://billing-application-backend.onrender.com/api/register";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Signup successful");
        setAction("Login");
        setEmailValue("");
        setPasswordValue("");
        navigate("/");
      } else {
        toast.error("User Already Exist or Error signing up");
      }
    } catch (error) {
      console.error("Network error", error);
    }
  };

  const handleOTP = async () => {
    const url = "https://billing-application-backend.onrender.com/api/generateOTP";
    const data = {
      userMail: userMail,
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        toast.success("OTP sent successfully");
      } else {
        toast.error("Error sending OTP");
      }
    } catch (error) {
      console.error("Network error", error);
    }
  };

  const handleLogin = async () => {
    if (!userMail || !userPassword) {
      return;
    }
    const userType = userMail.toLowerCase() === "admin@gmail.com" ? "ADMIN" : "USER";

    const data = {
      userMail: userMail,
      userPassword: userPassword,
      userType: userType,
    };

    const url = "https://billing-application-backend.onrender.com/api/login";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setEmailValue("");
        setPasswordValue("");
        const { token } = await response.json();
        localStorage.setItem("token", token);
        toast.success("Login successful");

        if (userType === "ADMIN") {
          navigate("/Admin-Portal", { state: { Email: userMail } });
        } else {
          navigate("/User-Portal", { state: { Email: userMail } });
        }
      } else {
        toast.error("Error logging in");
        console.error("Error logging in");
      }
    } catch (error) {
      console.error("Network error", error);
    }
  };

  const handleGoogleLogin = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log(credentialResponse);
    setEmailValue(decoded.email);
    setPasswordValue(decoded.sub);

    const action = decoded.email ? "Login" : "SignUp";

    if (action === "Login") {
      handleLogin();
    } else {
      handleSignUp();
    }
  };

  const clearForm = () => {
    setEmailValue("");
    setPasswordValue("");
    setOTP("");
  }

  return (
    <>
      <div className="container">
        <div className="image-container">
          {action === "SignUp" ? (
            <img className="image" src={sigin} alt="" />
          ) : (
            <img className="image2" src={login} alt="" />
          )}
        </div>
        <div className="form-container">
          <div className="header">
            <div className="text">{action}</div>
          </div>
          <div className="inputs">
            <div className="input">
              <img src={email} alt="" />
              <input
                type="email"
                placeholder="Email"
                value={userMail}
                onChange={(e) => setEmailValue(e.target.value)}
              />
            </div>
            <div className="input">
              <img src={password} alt="" />
              <input
                type="password"
                placeholder="Password"
                value={userPassword}
                onChange={(e) => setPasswordValue(e.target.value)}
              />
            </div>
            {action === "SignUp" && (
              <div className="input">
                <img src={person} alt="" />
                <input
                  type="password"
                  placeholder="OTP"
                  value={userOTP}
                  onChange={(e) => setOTP(e.target.value)}
                />
                {action === "SignUp" && (
                  <div className="inputRadio">
                    <div className="OTP" onClick={() => handleOTP()}>
                      SendOTP
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="google">
        <GoogleOAuthProvider clientId="237527326931-a50s4bpke0pdavbge7gg8npsv4a2n272.apps.googleusercontent.com">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </GoogleOAuthProvider>
        <div className="inputRadio">
                    <div className="clear" onClick={() => clearForm()}>
                      Clear
                    </div>
                  </div>
      </div>
          <div className="submit-container">
            <div
              className={action === "Login" ? "submit gray" : "submit"}
              onClick={() => {
                setAction("SignUp");
                handleSignUp();
              }}
            >
              Sign Up
            </div>
            <div
              className={action === "SignUp" ? "submit gray" : "submit"}
              onClick={() => {
                setAction("Login");
                handleLogin();
              }}
            >
              Login
            </div>
            <br />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginSignup;
