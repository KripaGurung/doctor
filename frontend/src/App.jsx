import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Navbar from './Components/Navbar'; 
import Footer from './Components/Footer';
import Appointment from './pages/Appointment';
import Option from './pages/Option';
import Myprofile from './pages/Myprofile';

const App = () => {
  const location = useLocation();

  return (
    <div className='mx-4 sm:mx-[10%]'>
      {location.pathname !== '/patient-login' && location.pathname !== '/' && <Navbar />}
      <Routes>
      <Route path="/" element={<div className="w-full mx-0"><Option /></div>} />
        <Route path="/patient-login" element={<Login />} />
        <Route path="home" element={<Home />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="doctors/:speciality" element={<Doctors />} />
        <Route path="/appointment/:docId" element={<Appointment />} />
        <Route path='my-profile' element={<Myprofile/>}/>
        {/* Handle unknown routes */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
      {location.pathname !== '/patient-login' && location.pathname !== '/' && <Footer />}
    </div>
  );
};

export default App;