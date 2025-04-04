import React, { useContext } from 'react';
import Login from './pages/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import { AdminContext } from './context/AdminContext';
import { DoctorContext } from './context/DoctorContext';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';


import DoctorList from './pages/Admin/DoctorList';
import AddDoctors from './pages/Admin/AddDoctors';
import AllAppointments from './pages/Admin/AllAppointment';
import AdminDashboard from './pages/Admin/AdminDashboard'; 
import DoctorDashBoard from './pages/Doctor/DoctorDashBoard';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorProfile from './pages/Doctor/DoctorProfile';

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  return aToken || dToken ? (
    <div className='bg-[#F8F9FD] h-screen flex flex-col'> 
      <ToastContainer />
      <Navbar />
      <div className='flex flex-1 overflow-hidden'>
        <div className='bg-white border-r'>
          <Sidebar />
        </div>
        <div className='flex-1 overflow-y-auto'>
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path='/doctors-list' element={<DoctorList />} />
            <Route path='/all-appointments' element={<AllAppointments />} />
            <Route path='/add-doctors' element={<AddDoctors />} />

            {/* Doctor routes */}
            <Route path='/doctor-dashboard' element={<DoctorDashBoard/>} />
            <Route path='/doctor-appointments' element={<DoctorAppointments/>} />
            <Route path='/doctor-profile' element={<DoctorProfile/>} />

          </Routes>
        </div>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
};


export default App