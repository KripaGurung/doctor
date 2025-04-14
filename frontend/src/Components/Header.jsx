import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
const Header = () => {

  const navigate = useNavigate();

  const navToBookDoctor = () => {
    navigate('/doctors');
  }

  return (
    <div className='flex flex-col md:flex-row items-center bg-gradient-to-r from-teal-700 to-blue-500 rounded-lg px-6 md:px-12 lg:px-24 py-10 md:py-16 lg:py-20 relative'>

      {/* ----- Left Side ----- */}
      <div className='md:w-1/2 flex flex-col items-start justify-center gap-6 text-white z-10'>
        <p className='text-3xl md:text-4xl lg:text-5xl font-bold leading-tight'>
          Book Appointment <br /> With Verified Doctors
        </p>
        <p className='text-lg md:text-xl text-gray-200'>
        Find the right doctor in seconds, <br />
        schedule your visit without any hassle!
        </p>
        <a href="#speciality" onClick={() => navToBookDoctor()} className='flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-3 rounded-lg transition-all'>
          Book Appointment 
          <img src={assets.arrow} alt="arrow" className='w-6' />
        </a>
      </div>

      {/* ----- Right Side  ----- */}
      <div className='md:w-1/2 flex justify-end mt-8 md:mt-0 relative'>
        <img 
          src={assets.Group} 
          alt="group" 
          className='w-full max-w-xl md:max-w-2xl lg:max-w-[650px]'/>
      </div>
    </div>
  );
}

export default Header;
