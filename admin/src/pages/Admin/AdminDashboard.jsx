import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctorCount, setDoctorCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  const [dateRange, setDateRange] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchPendingDoctors();
    fetchDoctorCount();
    fetchPatientCount();
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/admin/appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("aToken")}`,
        },
      });

      if (response.data.success) {
        const formattedAppointments = response.data.appointments.map((apt) => ({
          id: apt._id,
          patientName: apt.user?.name || "Unknown Patient",
          patientEmail: apt.user?.email,
          doctorName: apt.docData?.name || "Unknown Doctor",
          doctorSpeciality: apt.docData?.speciality,
          date: apt.slotDate,
          time: apt.slotTime,
          status: apt.status,
          amount: apt.amount,
        }));

        setAppointments(formattedAppointments);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to fetch appointments");
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (apt) => apt.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    const today = new Date();
    switch (dateRange) {
      case "week":
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter((apt) => new Date(apt.date) > weekAgo);
        break;
      case "month":
        const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1);
        filtered = filtered.filter((apt) => new Date(apt.date) > monthAgo);
        break;
      case "year":
        const yearAgo = new Date(today.getFullYear() - 1, today.getMonth());
        filtered = filtered.filter((apt) => new Date(apt.date) > yearAgo);
        break;
      default:
        break;
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

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
        const formattedDoctors = response.data.doctors.map((doc) => ({
          id: doc._id,
          name: doc.name,
          email: doc.email,
          specialty: doc.specialty || "General",
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

  const handleApproveDoctor = async (id) => {
    try {
      const response = await axios.put(`http://localhost:4000/api/admin/approve-doctor/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("aToken")}`,
        },
      });
      if (response.data.success) {
        setDoctors(doctors.filter((doc) => doc.id !== id));
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
        setDoctors(doctors.filter((doc) => doc.id !== id));
        toast.success("Doctor rejected successfully");
      }
    } catch (error) {
      console.error("Error rejecting doctor:", error);
      toast.error("Failed to reject doctor");
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

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* History of Appointments */}
      <div className="bg-white rounded-lg shadow-sm mt-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-semibold">History of Appointments</h2>
            <div className="flex flex-wrap gap-3">
              <select
                className="px-3 py-2 border rounded-md text-sm"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
                <option value="year">Past Year</option>
              </select>
              <select
                className="px-3 py-2 border rounded-md text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filterAppointments().map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                    <div className="text-sm text-gray-500">{appointment.patientEmail}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{appointment.doctorName}</div>
                    <div className="text-sm text-gray-500">{appointment.doctorSpeciality}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{appointment.date}</div>
                    <div className="text-sm text-gray-500">{appointment.time}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filterAppointments().length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No appointments found for the selected filters
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
    </div>
  );
};

export default AdminDashboard