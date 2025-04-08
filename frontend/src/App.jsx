import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Navbar from './Components/Navbar'; 
import Footer from './Components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Appointment from './pages/Appointment';
import Option from './pages/Option';
import Myprofile from './pages/Myprofile';
import MyAppointment from './pages/MyAppointment';
import DoctorForm from './pages/DoctorForm';
import SubmissionPage from "./pages/SubmissionPage";
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';


const App = () => {
  const location = useLocation();
  const hideNavFooter = location.pathname === '/patient-login' || location.pathname === '/' || location.pathname === '/doctor-apply' || 
  location.pathname === '/submission' || location.pathname === '/forgot-password' || location.pathname === '/reset-password/:token';

  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      {!hideNavFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<div className="w-full mx-0"><Option /></div>} />
        <Route path="/patient-login" element={<Login />} />
        <Route path="home" element={<Home />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="doctors/:speciality" element={<Doctors />} />
        <Route path="/appointment/:docId" element={<Appointment />} />
        <Route path="/appointments" element={<MyAppointment />} />
        <Route path='/my-profile' element={<Myprofile />} />
        <Route path='/doctor-apply' element={<DoctorForm />} />
        <Route path="/submission" element={<SubmissionPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/* Handle unknown routes */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
      {!hideNavFooter && <Footer />}
    </div>
  );
};

export default App;
