import React, { useEffect, useState } from 'react';
import "../style.css";
import Button from 'react-bootstrap/Button';
import axios from 'axios'; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import addData from "../Assets/addData.png"

export default function AddData(props) {
    useEffect(() => {
        document.title = props.pageTitle;
      }, [props.pageTitle]);

  const navigate = useNavigate();
  const [billTitle, setBillTitle] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [userEmail, setEmailValue] = useState('');
  const token = localStorage.getItem('token');

  const handleAdd = () => {
    const newData = {
        billTitle,
      billAmount,
      userEmail
    };
    
    axios.post('http://localhost:5000/api/billCreation', newData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
  },
})
      .then(response => {
        toast.success("Data Added Successfully");
        navigate('/Admin-Portal');
      })
      .catch(error => {
        toast.error("Error adding data");
        console.error('Error adding data:', error);
      });
  };

  return (
    <>
      <div className="mainHeading">Admin - Add Data</div>
      {/* <Button variant="danger" onClick={() => handleLogout()}>Logout</Button> */}
      <div className="container">
      <div className="image-container">
      <img className="image3" src={addData} alt="" />
      </div>
        <div className="form-container">
          <div className="header"></div>
          <div className="inputs">
            <div className="input">
              <input
                type="text"
                placeholder="Bill Title"
                value={billTitle}
                onChange={(e) => setBillTitle(e.target.value)}
              />
            </div>
            <div className="input">
              <input
                type="text"
                placeholder="Bill Amount"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
              />
            </div>
            <div className="input">
              <input
                type="mail"
                placeholder="User Mail"
                value={userEmail}
                onChange={(e) => setEmailValue(e.target.value)}
              />
            </div>
            <Button variant="primary" onClick={() => handleAdd()}>Add</Button>
          </div>
        </div>
      </div>
    </>
  )
}
