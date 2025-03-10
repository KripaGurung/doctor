import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {

    const {aToken} = useContext(AdminContext)
  return (
    <div className='min-h-scren bg-white border-r'>
        {
            aToken && <ul className='text-[#515151] mt-5'>
            
            <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/'} >
                <img src={assets.dashboard} alt="" className="w-6 h-6 object-contain"/>
                <p>Dashboard</p>
            </NavLink>

            <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/all-appointments'}>
                <img src={assets.appointment} alt="" className="w-6 h-6 object-contain"/>
                <p>Appointment</p>
            </NavLink>

            <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/add-doctors'}>
                <img src={assets.add} alt="" className="w-6 h-6 object-contain"/>
                <p>Add Doctors</p>
            </NavLink>

            <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/doctors-list'}>
                <img src={assets.team} alt="" className="w-6 h-6 object-contain"/>
                <p>Doctor List</p>
            </NavLink>
            </ul>
        }
    </div>
  )
}

export default Sidebar