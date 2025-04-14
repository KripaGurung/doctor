import { createContext } from "react";
import { useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {

    const [aToken, setAToken] = useState((localStorage.getItem('aToken') ? localStorage.getItem('aToken') : ''))
    const [doctors, setDoctors] = useState([])
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState([])

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

      const getAllDoctors = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/admin/all-doctors`, {
          headers: {
            Authorization: `Bearer ${aToken}`, 
          },
        });
    
        if (data.success) {
          setDoctors(data.doctors);
          console.log(data.doctors);
        } else {
          toast.error(data.message || "Failed to fetch doctors");
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error("Failed to fetch doctors. Please try again.");
      }
    }

  const getDashData = async () => {
  try {
    const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
      headers: {
        Authorization: `Bearer ${aToken}`,
      },
    });

    if (data.success) {
      setDashData(data.dashData);
      console.log(data.dashData);
    } else {
      toast.error(data.message || "Failed to fetch dashboard data.");
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    toast.error("Failed to fetch dashboard data. Please try again.");
  }
}

const getAllAppointments = async () => {
  try {
    const response = await axios.get(`${backendUrl}/api/admin/appointments`, {
      headers: {
        Authorization: `Bearer ${aToken}`,
      },
    });
    if (response.data.success) {
      setAppointments(response.data.appointments || []);
    } else {
      toast.error(response.data.message || "Failed to fetch appointments");
    }
  } catch (error) {
    console.error("Error fetching appointments:", error);
    toast.error("Failed to fetch appointments");
  }
}

    const value = {
        aToken,setAToken,
        backendUrl,doctors,
        getAllDoctors, dashData, getDashData, getAllAppointments
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider