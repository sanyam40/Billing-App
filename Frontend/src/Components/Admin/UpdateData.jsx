import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import "../style.css";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'; 
import { useNavigate } from "react-router-dom";
import updateData from "../Assets/updateData.jpg"

export default function UpdateData(props) {
  useEffect(() => {
    document.title = props.pageTitle;
  }, [props.pageTitle]);

  const location = useLocation();
  const navigate = useNavigate();

  const [BillId] = useState(location.state.billId);
  const [billTitle, setBillTitle] = useState(location.state.billTitle);
  const [billAmount, setBillAmount] = useState(location.state.billAmount);
  const [status, setStatus] = useState(location.state.status);
  const [userEmail] = useState(location.state.userEmail); 
  const token = localStorage.getItem('token');
  
  const handleUpdate = () => {
    const updatedData = {
      billTitle,
      billAmount,
      status,
      userEmail
    };

    axios.put(`http://localhost:5000/api/updateBills/${BillId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        toast.success("Data Updated Successfully");
        navigate('/Admin-Portal');
      })
      .catch(error => {
        console.error('Error updating data:', error);
        toast.error("Error updating data");
      });
  };

  return (
    <>
      <div className="mainHeading">Admin - Update for Bill Id : {BillId}</div>
      <div className="container">
      <div className="image-container">
      <img className="image3" src={updateData} alt="" />
      </div>
        <div className="form-container">
          <div className="header"></div>
          <div className="inputs">
          <div className="input">
              <h5>User Mail : {userEmail}</h5>
            </div>
            <div className="input">
              <input
                type="text"
                placeholder="Bill Title"
                value={billTitle}
                onChange={(e) => setBillTitle(e.target.value)}
              />
            </div>
            <div className="input">
            <span className="rs-symbol">Rs. </span>
              <input
                type="text"
                placeholder="Bill Amount"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
              />
            </div>
            
            <div className="input">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="PAID">PAID</option>
                <option value="UNPAID">UNPAID</option>
              </select>
            </div>
            <Button variant="primary" onClick={() => handleUpdate()}>Update</Button>
          </div>
        </div>
      </div>
    </>
  );
}
