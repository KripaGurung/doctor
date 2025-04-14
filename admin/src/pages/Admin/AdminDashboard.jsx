import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { X } from 'lucide-react';

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctorCount, setDoctorCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  const [doctorApplications, setDoctorApplications] = useState([
    {
      id: 1,
      name: "Dr. John Smith",
      email: "john.smith@example.com",
      specialty: "Cardiology"
    },
    {
      id: 2,
      name: "Dr. Emily Johnson",
      email: "emily.johnson@example.com",
      specialty: "Neurology"
    },
    {
      id: 3,
      name: "Dr. Michael Brown",
      email: "michael.brown@example.com",
      specialty: "Pediatrics"
    }
  ]);

  useEffect(() => {
    fetchPendingDoctors();
    fetchDoctorCount();
    fetchPatientCount();
    fetchAppointments();
  }, []);

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/admin/appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("aToken")}`,
        },
      });
      
      if (response.data.success) {
        const formattedAppointments = response.data.appointments.map(apt => {
          // Log the raw appointment data
          console.log('Raw appointment:', apt);
          
          // Extract doctor name from docData
          const doctorName = apt.docData?.name 
            ? apt.docData.name.startsWith('Dr.') 
              ? apt.docData.name // If name already starts with "Dr.", use as is
              : `Dr. ${apt.docData.name}` // Add "Dr." only if not present
            : 'Doctor data not available';

          // Format the date and time
          const bookingDate = apt.slotDate && apt.slotTime
            ? `Booking on ${apt.slotDate} at ${apt.slotTime}`
            : 'Booking date not available';
          
          return {
            id: apt._id,
            doctorName,
            bookingDate,
            status: apt.status || 'pending'
          };
        });
        
        setAppointments(formattedAppointments);
      } else {
        toast.error(response.data.message || "Failed to fetch appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to fetch appointments");
    }
  };

  // Fetch patient count
  const fetchPatientCount = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/admin/patient-count", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("aToken")}`,
        },
      });
      setPatientCount(response.data.count || 0);
    } catch (error) {
      console.error("Error fetching patient count:", error);
      toast.error("Failed to fetch patient count.");
    }
  };

  // Fetch pending doctors
  const fetchPendingDoctors = async () => {
    const token = localStorage.getItem("aToken");

    if (!token) {
      toast.error("Unauthorized: No token found. Please login again.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:4000/api/admin/pending-doctors", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        const formattedDoctors = response.data.doctors.map(doc => ({
          id: doc._id,
          name: doc.name,
          email: doc.email,
          specialty: doc.specialty || 'General'
        }));
        setDoctors(formattedDoctors);
      } else {
        toast.error(response.data.message || "Failed to fetch pending doctors.");
        setDoctors([]);
      }
    } catch (error) {
      console.error("Error fetching pending doctors:", error.response);
      toast.error("Authorization failed. Please login again.");
    }
  };

  // Fetch doctor count
  const fetchDoctorCount = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/admin/doctor-count", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("aToken")}`,
        },
      });
      setDoctorCount(response.data.count || 0);
    } catch (error) {
      console.error("Error fetching doctor count:", error);
      toast.error("Failed to fetch doctor count.");
    }
  };

  const handleRemoveAppointment = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/admin/appointments/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("aToken")}`,
        },
      });
      if (response.data.success) {
        setAppointments(appointments.filter(app => app.id !== id));
        toast.success("Appointment removed successfully");
      }
    } catch (error) {
      console.error("Error removing appointment:", error);
      toast.error("Failed to remove appointment");
    }
  };

  const handleApproveDoctor = async (id) => {
    try {
      const response = await axios.put(`http://localhost:4000/api/admin/approve-doctor/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("aToken")}`,
        },
      });
      if (response.data.success) {
        setDoctors(doctors.filter(doc => doc.id !== id));
        toast.success("Doctor approved successfully");
      }
    } catch (error) {
      console.error("Error approving doctor:", error);
      toast.error("Failed to approve doctor");
    }
  };

  const handleRejectDoctor = async (id) => {
    try {
      const response = await axios.put(`http://localhost:4000/api/admin/reject-doctor/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("aToken")}`,
        },
      });
      if (response.data.success) {
        setDoctors(doctors.filter(doc => doc.id !== id));
        toast.success("Doctor rejected successfully");
      }
    } catch (error) {
      console.error("Error rejecting doctor:", error);
      toast.error("Failed to reject doctor");
    }
  };

  const getStatusColor = (status) => {
    // Default to pending if status is undefined
    const currentStatus = (status || 'pending').toLowerCase();
    
    switch (currentStatus) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white rounded-lg shadow flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Doctors</p>
            <p className="text-2xl font-bold">{doctorCount}</p>
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Patients</p>
            <p className="text-2xl font-bold">{patientCount}</p>
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Appointments</p>
            <p className="text-2xl font-bold">{appointments.length}</p>
          </div>
        </div>
      </div>

      {/* Latest Appointments */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Latest Appointments</h2>
          <button className="text-blue-600 hover:text-blue-800 text-sm">
            View All
          </button>
        </div>
        <div className="divide-y">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <div key={appointment._id} className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{appointment.doctorName}</h3>
                  <p className="text-sm text-gray-500">Booking on {appointment.bookingDate}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status || 'Pending'}
                  </span>
                  <button 
                    onClick={() => handleRemoveAppointment(appointment._id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              No appointments found
            </div>
          )}
        </div>
      </div>

      {/* Pending Doctor Applications */}
      <div className="bg-white rounded-lg shadow-sm mt-8">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Pending Doctor Applications</h2>
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
            {doctors.length} Pending
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">NAME</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">EMAIL</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">SPECIALTY</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <tr key={doctor.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                          {doctor.name.charAt(0)}
                        </span>
                        <span className="font-medium">{doctor.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{doctor.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        <span>{doctor.specialty}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApproveDoctor(doctor.id)}
                          className="px-3 py-1 bg-emerald-500 text-white rounded-md text-sm hover:bg-emerald-600 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectDoctor(doctor.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No pending doctor applications
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard