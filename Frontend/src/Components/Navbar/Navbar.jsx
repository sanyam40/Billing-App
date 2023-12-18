import React,{useState} from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./navbar.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Navbar() {
  const location = useLocation();
  const email = location.state ? location.state.Email : null;
  const navigate = useNavigate();
  const [showNavbar] = useState(false);
  const isAdminPage = location.pathname.startsWith("/Admin") || location.pathname.startsWith("/admin-portal");
  const isUserPortalPage = location.pathname.startsWith("/User-Portal");

  const handleLogout=()=>{
    const isConfirmed = window.confirm('Are you sure you want to Logout?');
    if (isConfirmed) {
      localStorage.removeItem('token');
      toast.success("Logged out successfully");
      navigate('/');
    } else {
      console.log('Logout canceled');
    }
  };

  return (
    <nav className="navbar">
      <div className="bill-text">
        <b>
          <i>Billing Application</i>
        </b>
      </div>
      <div className="con">
        <div className={`nav-elements ${showNavbar && "active"}`}>
          {isAdminPage ? (
            <ul>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/">Aboutus</NavLink>
            </li>
            <li>
              <NavLink to="/Admin/AddData">Generate New Bill</NavLink>
            </li>
            <li>
            <NavLink to="/" onClick={handleLogout}>LOGOUT ({email})</NavLink>    
            </li>
          </ul>
          ): isUserPortalPage ? (
            <ul>
              <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/">Aboutus</NavLink>
            </li>
            <li>
                <NavLink to="/" onClick={handleLogout}>LOGOUT ({email})</NavLink>
            </li>
            </ul>
          )  : (
            <ul>
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li>
                <NavLink to="/">Aboutus</NavLink>
              </li>
              <li>
                <NavLink to="/">Login/SignUp</NavLink>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
