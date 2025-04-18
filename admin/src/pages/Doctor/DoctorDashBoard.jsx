// import React, { useContext, useState, useEffect } from 'react'; // Ensure useContext is imported
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import Doctorsidebar from '../../components/ui/Doctorsidebar';
// import Doctornavbar from '../../components/ui/Doctornavbar';
// import { DoctorContext } from '../../context/DoctorContext';

// const DoctorDashboard = () => {
//   const { backendUrl, dToken } = useContext(DoctorContext);
//   const [dashboardData, setDashboardData] = useState(null);
//   const [appointments, setAppointments] = useState([]);
  

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!dToken) {
//         toast.error("Please login to access the dashboard");
//         return;
//       }

//       try {
//         // Fetch dashboard data
//         const { data: dashboard } = await axios.get(`${backendUrl}/api/doctor/dashboard`, {
//           headers: {
//             dtoken: dToken,
//           },
//         });
//         setDashboardData(dashboard);

//         // Fetch appointments for the logged-in doctor
//         const { data: appointmentsData } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
//           headers: {
//             dtoken: dToken,
//           },
//         });
//         setAppointments(appointmentsData); // Assuming the API returns an array of appointments
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         if (error.response?.status === 401) {
//           toast.error("Session expired. Please login again.");
//         } else {
//           toast.error("Failed to fetch data");
//         }
//       }
//     };

//     fetchData();
//   }, [backendUrl, dToken]);

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <Doctorsidebar />
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Doctornavbar />
//         <main className="flex-1 overflow-y-auto p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
//             <div className="bg-white rounded-lg shadow p-4">
//               <h2 className="text-lg font-semibold text-medical-primary mb-2">Today's Appointments</h2>
//               <div className="text-3xl font-bold">8</div>
//               <p className="text-gray-500 text-sm">2 urgent cases</p>
//             </div>

//             <div className="bg-white rounded-lg shadow p-4">
//               <h2 className="text-lg font-semibold text-medical-primary mb-2">Total Patients</h2>
//               <div className="text-3xl font-bold">243</div>
//               <p className="text-gray-500 text-sm">12 new this month</p>
//             </div>

//             <div className="bg-white rounded-lg shadow p-4">
//               <h2 className="text-lg font-semibold text-medical-primary mb-2">Pending Reports</h2>
//               <div className="text-3xl font-bold">5</div>
//               <p className="text-gray-500 text-sm">Due by tomorrow</p>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow p-4 mb-6">
//             <h2 className="text-lg font-semibold text-medical-primary mb-4">Appointment Request</h2>
//             <div className="space-y-3">
//               {appointments.length > 0 ? (
//                 appointments.map((appointment, index) => (
//                   <div key={index} className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50">
//                     <div className="flex items-center">
//                       <div className="bg-medical-light text-medical-primary font-semibold rounded-md p-2 mr-3">
//                         {appointment.time}
//                       </div>
//                       <div>
//                         <div className="font-medium">{appointment.patient}</div>
//                         <div className="text-sm text-gray-500">{appointment.reason}</div>
//                       </div>
//                     </div>
//                     <div className="space-x-2">
//   {appointment.status !== 'Confirmed' ? (
//     <>
//       <button
//         className="px-3 py-1 text-xs bg-green-500 text-white rounded"
//         onClick={() => handleApprove(appointment._id)}
//       >
//         Approve
//       </button>
//       <button
//         className="px-3 py-1 text-xs bg-red-500 text-white rounded"
//         onClick={() => handleReject(appointment._id)}
//       >
//         Reject
//       </button>
//     </>
//   ) : (
//     <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
//       Confirmed
//     </span>
//   )}
// </div>

//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-500 text-sm">No appointment request</p>
//               )}
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DoctorDashboard;


// import React, { useContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import Doctorsidebar from '../../components/ui/Doctorsidebar';
// import Doctornavbar from '../../components/ui/Doctornavbar';
// import { DoctorContext } from '../../context/DoctorContext';

// const DoctorDashboard = () => {
//   const { backendUrl, dToken } = useContext(DoctorContext);
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       if (!dToken) {
//         toast.error("Please login to access the dashboard");
//         return;
//       }

//       try {
//         const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
//           headers: { dtoken: dToken },
//         });

//         setAppointments(data);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching appointments:', error);
//         toast.error(error.response?.data?.message || "Failed to fetch appointments");
//         setLoading(false);
//       }
//     };

//     fetchAppointments();
//   }, [backendUrl, dToken]);

//   const handleApprove = async (appointmentId) => {
//     try {
//       await axios.patch(
//         `${backendUrl}/api/doctor/appointments/${appointmentId}/approve`,
//         {},
//         { headers: { dtoken: dToken } }
//       );

//       setAppointments(appointments.map(apt => 
//         apt._id === appointmentId 
//           ? { ...apt, status: 'Confirmed' } 
//           : apt
//       ));
      
//       toast.success('Appointment approved successfully');
//     } catch (error) {
//       console.error('Error approving appointment:', error);
//       toast.error(error.response?.data?.message || 'Failed to approve appointment');
//     }
//   };

//   const handleReject = async (appointmentId) => {
//     try {
//       await axios.patch(
//         `${backendUrl}/api/doctor/appointments/${appointmentId}/reject`,
//         {},
//         { headers: { dtoken: dToken } }
//       );

//       setAppointments(appointments.map(apt => 
//         apt._id === appointmentId 
//           ? { ...apt, status: 'Rejected' } 
//           : apt
//       ));
      
//       toast.success('Appointment rejected successfully');
//     } catch (error) {
//       console.error('Error rejecting appointment:', error);
//       toast.error(error.response?.data?.message || 'Failed to reject appointment');
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <Doctorsidebar />
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Doctornavbar />
//         <main className="flex-1 overflow-y-auto p-6">
//           {/* Dashboard Stats */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//             <div className="bg-white rounded-lg shadow p-6">
//               <h2 className="text-lg font-semibold mb-2">Today's Appointments</h2>
//               <p className="text-3xl font-bold">
//                 {appointments.filter(apt => apt.status === 'Pending').length}
//               </p>
//             </div>
//             {/* Add more stat cards as needed */}
//           </div>

//           {/* Appointment Requests Section */}
//           <div className="bg-white rounded-lg shadow">
//             <div className="p-6 border-b border-gray-200">
//               <h2 className="text-xl font-semibold">Appointment Requests</h2>
//             </div>
//             <div className="p-6">
//               {loading ? (
//                 <div className="text-center py-4">Loading appointments...</div>
//               ) : appointments.length === 0 ? (
//                 <div className="text-center py-4 text-gray-500">No appointment requests</div>
//               ) : (
//                 <div className="space-y-4">
//                   {appointments.map((appointment) => (
//                     <div 
//                       key={appointment._id}
//                       className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
//                     >
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <h3 className="font-medium text-lg">
//                             {appointment.user?.name || 'Patient'}
//                           </h3>
//                           <p className="text-gray-600">
//                             {appointment.slotDate} at {appointment.slotTime}
//                           </p>
//                           <div className="mt-2 space-y-1 text-sm text-gray-500">
//                             <p>Email: {appointment.user?.email}</p>
//                             <p>Reason: {appointment.reason || 'General Consultation'}</p>
//                           </div>
//                         </div>
//                         <div className="flex gap-2">
//                           {appointment.status === 'Pending' && (
//                             <>
//                               <button
//                                 onClick={() => handleApprove(appointment._id)}
//                                 className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
//                               >
//                                 Approve
//                               </button>
//                               <button
//                                 onClick={() => handleReject(appointment._id)}
//                                 className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
//                               >
//                                 Reject
//                               </button>
//                             </>
//                           )}
//                           <span className={`px-3 py-1 rounded-full text-sm ${
//                             appointment.status === 'Confirmed' 
//                               ? 'bg-green-100 text-green-800'
//                               : appointment.status === 'Rejected'
//                               ? 'bg-red-100 text-red-800'
//                               : 'bg-yellow-100 text-yellow-800'
//                           }`}>
//                             {appointment.status}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DoctorDashboard;

import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Doctorsidebar from '../../components/ui/Doctorsidebar';
import Doctornavbar from '../../components/ui/Doctornavbar';
import { DoctorContext } from '../../context/DoctorContext';

const DoctorDashboard = () => {
  const { backendUrl, dToken } = useContext(DoctorContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayConfirmed: 0,
    pendingRequests: 0,
    totalAppointments: 0
  });

  useEffect(() => {
    fetchAppointments();
  }, [backendUrl, dToken]);

  const fetchAppointments = async () => {
    if (!dToken) {
      toast.error("Please login to access the dashboard");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
        headers: { dtoken: dToken }
      });

      if (Array.isArray(data)) {
        setAppointments(data);
        calculateStats(data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error(error.response?.data?.message || "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (appointmentsData) => {
    const today = new Date().toISOString().split('T')[0];
    
    const todayConfirmed = appointmentsData.filter(apt => 
      apt.status === 'Confirmed' && apt.slotDate === today
    ).length;

    const pendingRequests = appointmentsData.filter(apt => 
      apt.status === 'Pending'
    ).length;

    setStats({
      todayConfirmed,
      pendingRequests,
      totalAppointments: appointmentsData.length
    });
  };

  const handleApprove = async (appointmentId) => {
    try {
      const { data } = await axios.patch(
        `${backendUrl}/api/doctor/appointments/${appointmentId}/approve`,
        {},
        { headers: { dtoken: dToken } }
      );

      if (data.success) {
        setAppointments(prev =>
          prev.map(apt =>
            apt._id === appointmentId ? { ...apt, status: 'Confirmed' } : apt
          )
        );
        calculateStats(appointments);
        toast.success('Appointment approved successfully');
      }
    } catch (error) {
      console.error('Error approving appointment:', error);
      toast.error('Failed to approve appointment');
    }
  };

  const handleReject = async (appointmentId) => {
    try {
      const { data } = await axios.patch(
        `${backendUrl}/api/doctor/appointments/${appointmentId}/reject`,
        {},
        { headers: { dtoken: dToken } }
      );

      if (data.success) {
        setAppointments(prev =>
          prev.filter(apt => apt._id !== appointmentId)
        );
        calculateStats(appointments.filter(apt => apt._id !== appointmentId));
        toast.success('Appointment rejected successfully');
      }
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      toast.error('Failed to reject appointment');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Doctorsidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Doctornavbar />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Today's Appointments Card */}
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Today's Appointments
                  </h2>
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    {stats.todayConfirmed} Confirmed
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Scheduled for today</span>
                </div>
              </div>
            </div>

            {/* Requested Appointments Card */}
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Pending Requests
                  </h2>
                  <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
                    {stats.pendingRequests} Pending
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Awaiting approval</span>
                </div>
              </div>
            </div>
          </div>

          {/* Appointments List */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Recent Appointment Requests</h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : appointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No appointment requests found
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div 
                      key={appointment._id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">
                            {appointment.user?.name || 'Patient'}
                          </h3>
                          <p className="text-gray-600">
                            {appointment.slotDate} at {appointment.slotTime}
                          </p>
                          <div className="mt-2 space-y-1 text-sm text-gray-500">
                            <p>Email: {appointment.user?.email}</p>
                            <p>Reason: {appointment.reason || 'General Consultation'}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {appointment.status === 'Pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleApprove(appointment._id)}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(appointment._id)}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            appointment.status === 'Confirmed' 
                              ? 'bg-green-100 text-green-800'
                              : appointment.status === 'Rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;