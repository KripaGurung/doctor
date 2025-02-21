import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Navbar from './Components/Navbar'; 
import Footer from './Components/Footer';

const App = () => {
  const location = useLocation();

  return (
    <div className='mx-4 sm:mx-[10%]'>
      {location.pathname !== '/login' && <Navbar />}
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="home" element={<Home />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="doctors/:speciality" element={<Doctors />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;