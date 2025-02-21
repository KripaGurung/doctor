import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {assets} from '../assets/assets';

const Navbar = () => {
    const navigate = useNavigate();

    const [showMenu, setShowMenu] = useState(false);
    const [token, setToken] = useState(true);

    return (
       <div className= "mx-4 sm:mx-[10%]">
           <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-gray-400'>
               <img onClick={() =>navigate('/')} src='assets/logo.png' alt='logo' className='w-44 cursor-pointer'/>
               <ul className='hidden md:flex items-start gap-5 font medium'>
                   <NavLink to={'/home'}>
                       <li className='py-1'>Home</li>
                       <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                   </NavLink>
                   <NavLink to={'/doctors'}>
                       <li className='py-1'>Doctors</li>
                       <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                   </NavLink>
                   <NavLink to={'/appointments'}>
                       <li className='py-1'>My Appointments</li>
                       <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                   </NavLink>
               </ul>
               <div className='flex items-center gap-4'>
                {token 
                ? <div className='flex items-center gap-2 cursor-pointer group relative' onClick={() => setShowMenu(!showMenu)}>
                    <img className='w-5 rounded-full' src={assets.user} alt="user" />
                    <img className='w-7' src={assets.dropdown} alt="dropdown" />
                    <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 hidden group-hover:block w-auto'>
    <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
        <p onClick={()=>navigate('my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
        <p onClick={()=>navigate('appointment')} className='hover:text-black cursor-pointer'>My Appointment</p>
        <p onClick={()=>setToken(false)} className='hover:text-black cursor-pointer'>Logout</p>
    </div>
</div>

                </div>
                : <button onClick={() => navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>Create account</button>
            }
                   
               </div>
           </div>
       </div>
    );
};

export default Navbar;