import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [doctorCount, setDoctorCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPendingDoctors();
    fetchDoctorCount();
    fetchPatientCount();
  }, []);

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
        setDoctors(response.data.doctors || []);
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

  // Approve doctor
  const handleApprove = async (doctorId) => {
    try {
      await axios.post("http://localhost:4000/api/admin/approve-doctor", { doctorId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("aToken")}`,
        },
      });
      setDoctors((prevDoctors) => prevDoctors.filter((doctor) => doctor._id !== doctorId));
      fetchDoctorCount();
    } catch (error) {
      console.error("Error approving doctor", error);
      setError("Failed to approve doctor.");
    }
  };

  // Reject doctor
  const handleReject = async (doctorId) => {
    try {
      await axios.post("http://localhost:4000/api/admin/reject-doctor", { doctorId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("aToken")}`,
        },
      });
      setDoctors((prevDoctors) => prevDoctors.filter((doctor) => doctor._id !== doctorId));
    } catch (error) {
      console.error("Error rejecting doctor", error);
      setError("Failed to reject doctor.");
    }
  };

  return (
    <div className="p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white rounded shadow flex flex-col items-center">
          <p className="text-xl font-bold">{doctorCount}</p>
          <p className="text-gray-500">Doctors</p>
        </div>
        <div className="p-4 bg-white rounded shadow flex flex-col items-center">
          <p className="text-xl font-bold">{patientCount}</p>
          <p className="text-gray-500">Patients</p>
        </div>
        <div className="p-4 bg-white rounded shadow flex flex-col items-center">
          <p className="text-xl font-bold">2</p>
          <p className="text-gray-500">Appointments</p>
        </div>
      </div>

      {/* Latest Appointments */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Latest Appointments</h2>
        <ul>
          {[...Array(5)].map((_, index) => (
            <li key={index} className="flex justify-between items-center py-2 border-b">
              <div>
                <p className="font-semibold">Dr. Richard James</p>
                <p className="text-sm text-gray-500">Booking on 24th July, 2024</p>
              </div>
              <button className="text-red-500">✖</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Pending Doctor Applications */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Pending Doctor Applications</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Specialty</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(doctors) ? (
                doctors.length > 0 ? (
                  doctors.map((doctor) => (
                    <tr key={doctor._id} className="border">
                      <td className="py-2 px-4 border">{doctor.name}</td>
                      <td className="py-2 px-4 border">{doctor.email}</td>
                      <td className="py-2 px-4 border">{doctor.specialty}</td>
                      <td className="py-2 px-4 border flex gap-2">
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded"
                          onClick={() => handleApprove(doctor._id)}
                        >
                          Approve
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded"
                          onClick={() => handleReject(doctor._id)}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-2">
                      No pending doctor applications
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-2">Loading...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;