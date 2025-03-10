import React, { useContext } from 'react';
import Login from './pages/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import { AdminContext } from './context/AdminContext';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import DoctorList from './pages/Admin/DoctorList';
import AddDoctors from './pages/Admin/AddDoctors';
import AllAppointments from './pages/Admin/AllAppointment';
import Dashboard from './pages/Admin/Dashboard';  

const App = () => {
  const { aToken } = useContext(AdminContext);

  return aToken ? (
    <div className='bg-[#F8F9FD] h-screen flex flex-col'> 
      <ToastContainer />
      <Navbar />
      <div className='flex flex-1 overflow-hidden'>
        <div className='bg-white border-r'>
          <Sidebar />
        </div>
        <div className='flex-1 overflow-y-auto'>
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/doctors-list' element={<DoctorList />} />
            <Route path='/all-appointments' element={<AllAppointments />} />
            <Route path='/add-doctors' element={<AddDoctors />} />
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