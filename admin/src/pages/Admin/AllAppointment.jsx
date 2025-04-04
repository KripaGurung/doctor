import React, { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");

  const getAllAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/admin/appointments", {
        headers: {
          Authorization: `Bearer ${aToken}`,
        },
      });
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to fetch appointments.");
    }
  };

  const value = {
    aToken,
    appointments,
    getAllAppointments, // Ensure this is included
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export default AdminContextProvider;