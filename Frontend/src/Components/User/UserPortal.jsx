import React, { useEffect } from 'react';
import "../style.css";
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; 
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UserPortal(props) {

  const [data, setData] = useState([]);
  const location = useLocation();
  const m=location.state.Email;

  useEffect(() => {
    document.title = props.pageTitle;
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/getUserBills/${m}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [props.pageTitle,m]);

  const columns = [
    {
      name: 'Bill Id',
      selector: row => row.billId
    },
    {
      name: 'Bill Title',
      selector: row => row.billTitle
    },
    {
      name: 'User Email',
      selector: row => row.userEmail
    },
    {
      name: 'Bill Amount',
      selector: row => row.billAmount
    },
    {
      name: 'Generated Date',
      selector: row => row.billGenDate
    },
    {
      name: 'Due Date',
      selector: row => row.billDueDate
    },
    {
      name: 'Status',
      selector: row => row.status
    },
    {
      name: 'Pay Bill',
      selector: row => (
        <Button
          variant="success"
          onClick={() => handlePay(row)}
          disabled={row.status !== 'UNPAID'}
        >
          Pay
        </Button>
      ),
    },
    {
      name: 'Pay with Razor Pay',
      selector: row => (
        <Button
          variant="success"
          onClick={() => handleRazorPay(row)}
          disabled={row.status !== 'UNPAID'}
        >
          Pay
        </Button>
      ),
    },
  ];
  const initPayment = (data) => {
    const token = localStorage.getItem('token');
    const options = {
      key: "rzp_test_PYbadXP2xUO3u8",
      amount: data.amount,
      currency: data.currency,
      name: data.name,  
      description: "Test Transaction",
      image: data.img, 
      order_id: data.id,
      handler: async (response) => {
        try {
          const verifyUrl = "http://localhost:5000/verify";
          const { data } = await axios.post(
            verifyUrl,
            response,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (error) {
          console.log(error);
        }
      },
      theme: {
        color: "#3399cc",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const handleRazorPay = async (row) => { 
    try {
      const token = localStorage.getItem('token');
      const orderUrl = "http://localhost:5000/api/orders";
      const { data } = await axios.post(
        orderUrl,
        { amount: row.billAmount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ); 
      initPayment(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  
  const handlePay = async (row) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/api/pay/${row.billId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });  
      toast.success('Payment Done!'); 
      const response2 = await axios.get(`http://localhost:5000/api/getUserBills/${m}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response2.data);
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  return (
    <>
      <div className="mainHeading">User Portal</div>
      <div className="container">
        <DataTable columns={columns} data={data} fixedHeader></DataTable>
      </div>
    </>
  );
}
