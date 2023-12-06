import React, { useEffect,useState } from 'react';
import "../style.css";
import { useNavigate } from "react-router-dom";
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'; 

export default function DisplayData(props) {

  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    document.title = props.pageTitle;
    const token = localStorage.getItem('token');

    axios.get('http://localhost:5000/api/getAllBills', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [props.pageTitle]);


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
      name: 'User Mail',
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
      name:'Update',
      selector: row => <Button variant="primary" onClick={() => handleUpdate(row)}>Update</Button>
    },
    {
      name:'Delete',
      selector: row => <Button variant="danger" onClick={() => handleDelete(row)}>Delete</Button>
    }
  ];

  const handleUpdate = (row) => {
    const isConfirmed = window.confirm('Are you sure you want to update this item?');
    if (isConfirmed) {
      console.log('Update confirmed for row:', row);
      navigate('/Admin/UpdateData', {state:{ 
        billId: row.billId,
        billTitle: row.billTitle,
        billAmount: row.billAmount,
        generatedDate: row.generatedDate,
        dueDate: row.dueDate,
        status: row.status,
        userEmail: row.userEmail,
      },});
    } else {
      console.log('Update canceled for row:', row);
    }
  };

  const handleDelete = (row) => {
    const isConfirmed = window.confirm('Are you sure you want to Delete this item?');
    if (isConfirmed) {
      console.log('Delete confirmed for row:', row);

      axios.delete(`http://localhost:5000/api/deleteBills/${row.billId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          toast.success("Data Deleted Successfully for Bill Id: "+row.billId);
          axios.get('http://localhost:5000/api/getAllBills', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then(response => {
              setData(response.data);
            })
            .catch(error => {
              toast.error("Error fetching data after deletion");
              console.error('Error fetching data after deletion:', error);
            });
        })
        .catch(error => {
          toast.error("Error deleting data");
          console.error('Error deleting data:', error);
        });
    } else {
      console.log('Delete canceled for row:', row);
    }
  };

  return (
    <>
      <div className="mainHeading">Admin Portal</div>
      <div className="container">
        <DataTable columns={columns} data={data} fixedHeader></DataTable>
      </div>
    </>
  );
}
