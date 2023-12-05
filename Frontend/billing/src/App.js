import './App.css';
import LoginSignup from './Components/HomePage/LoginSignup';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DisplayData from './Components/Admin/DisplayData';
import UserPortal from './Components/User/UserPortal';
import UpdateData from './Components/Admin/UpdateData';
import AddData from './Components/Admin/AddData';
import Notfound from './Components/Notfound';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Navbar/Footer/Footer';

function App() {
  return (
    <Router>
    <div>
      <ToastContainer />
      <Navbar/>
      <Routes>
        <Route path="/" element={<LoginSignup pageTitle="Billing-Login/SignUp" />} />
        <Route path="/Admin-Portal" element={<DisplayData pageTitle="Admin Portal" />} />
        <Route path="/User-Portal" element={<UserPortal pageTitle="User Portal" />} />
        <Route path="/Admin/UpdateData" element={<UpdateData pageTitle="Admin-Update" />} />
        <Route path="/Admin/AddData" element={<AddData pageTitle="Admin-ADD" />} />
        <Route path="*" element={<Notfound pageTitle="404 - Not Found" />} />
      </Routes>
    </div>
    <Footer/>
  </Router>
  );
}

export default App;
