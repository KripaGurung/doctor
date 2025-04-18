// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import Doctorsidebar from '../../components/ui/Doctorsidebar';
// import Doctornavbar from '../../components/ui/Doctornavbar';
// import { DoctorContext } from '../../context/DoctorContext';

// const AppointmentsView = () => {
//   const { backendUrl, dToken } = useContext(DoctorContext);
//   const [appointments, setAppointments] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('All');

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       console.log('dToken:', dToken); // Debugging the token
//       if (!dToken) {
//         toast.error('Authentication token is missing. Please log in again.');
//         window.location.href = '/login';
//         return;
//       }

//       // Verify token is valid before making request
//       const storedToken = localStorage.getItem('dToken');
//       if (!storedToken || storedToken !== dToken) {
//         toast.error('Session expired. Please log in again.');
//         window.location.href = '/login';
//         return;
//       }
  
//       try {
//         const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
//           headers: { dtoken: dToken },
//         });
//         if (Array.isArray(data)) {
//           setAppointments(data);
//         } else {
//           console.error('Unexpected API response:', data);
//           if (data.message === 'User not found') {
//             toast.error('Session expired. Please log in again.');
//             window.location.href = '/login';
//           } else {
//             toast.error(data.message || 'Failed to fetch appointments');
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching appointments:', error);
//         if (error.response?.status === 401 || error.response?.data?.message === 'User not found') {
//           toast.error('Session expired. Please log in again.');
//           window.location.href = '/login';
//         } else if (error.response && error.response.data) {
//           toast.error(error.response.data.message || 'Failed to fetch appointments');
//         } else {
//           toast.error('Failed to fetch appointments');
//         }
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
//       toast.success('Appointment approved');
//       setAppointments((prev) =>
//         prev.map((appt) =>
//           appt.id === appointmentId ? { ...appt, status: 'Confirmed' } : appt
//         )
//       );
//     } catch (error) {
//       console.error('Error approving appointment:', error);
//       toast.error('Failed to approve appointment');
//     }
//   };

//   const handleReject = async (appointmentId) => {
//     try {
//       await axios.patch(
//         `${backendUrl}/api/doctor/appointments/${appointmentId}/reject`,
//         {},
//         { headers: { dtoken: dToken } }
//       );
//       toast.success('Appointment rejected');
//       setAppointments((prev) =>
//         prev.map((appt) =>
//           appt.id === appointmentId ? { ...appt, status: 'Rejected' } : appt
//         )
//       );
//     } catch (error) {
//       console.error('Error rejecting appointment:', error);
//       toast.error('Failed to reject appointment');
//     }
//   };

//   const handleViewDetails = (appointment) => {
//     // Store the appointment details in localStorage or state management
//     localStorage.setItem('selectedAppointment', JSON.stringify(appointment));
//     // Navigate to the appointment details page
//     window.location.href = `/doctor-appointment-details/${appointment.id}`;
//   };

// // const filteredAppointments = Array.isArray(appointments)
// //   ? appointments.filter((appt) => {
// //       const matchesSearch = appt.patient.toLowerCase().includes(searchTerm.toLowerCase());
// //       const matchesStatus = statusFilter === 'All' || appt.status === statusFilter;
// //       return matchesSearch && matchesStatus;
// //     })
// //   : [];

// const filteredAppointments = (appointments || []).filter((appointment) =>
//   appointment.user?.name?.toLowerCase().includes((searchTerm || '').toLowerCase())
// );
  

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <Doctorsidebar />
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Doctornavbar />
//         <main className="flex-1 overflow-y-auto p-6">
//           <div className="max-w-7xl mx-auto">
//             <header className="mb-8">
//               <h1 className="text-3xl font-semibold text-gray-900">Appointments</h1>
//               <p className="text-gray-600 text-lg">Manage your patient appointments</p>
//             </header>

//             <div className="mb-8 flex flex-col sm:flex-row gap-4">
//               <input
//                 type="text"
//                 placeholder="Search by patient name..."
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//               <select
//                 className="px-4 py-3 border border-gray-300 rounded-lg"
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//               >
//                 <option value="All">All</option>
//                 <option value="Confirmed">Confirmed</option>
//                 <option value="Pending">Pending</option>
//                 <option value="Rejected">Rejected</option>
//               </select>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Date & Time</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Patient</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Status</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredAppointments.length > 0 ? (
//                     filteredAppointments.map((appointment) => (
//                       <tr
//                         key={appointment._id}
//                         className="cursor-pointer hover:bg-gray-50"
//                         onClick={() => handleViewDetails(appointment)}
//                       >
//                         <td className="px-4 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-500">{appointment.slotDate}</div>
//                           <div className="text-sm font-medium text-gray-900">{appointment.slotTime}</div>
//                         </td>
//                         <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {appointment.user?.name || 'Unknown'}
//                         </td>
//                         <td className="px-4 py-4 whitespace-nowrap">
//                           <span
//                             className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                               appointment.status === 'Confirmed'
//                                 ? 'bg-green-100 text-green-800'
//                                 : appointment.status === 'Pending'
//                                 ? 'bg-yellow-100 text-yellow-800'
//                                 : 'bg-red-100 text-red-800'
//                             }`}
//                           >
//                             {appointment.status}
//                           </span>
//                         </td>
//                         <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
//                           {appointment.status === 'Pending' && (
//                             <>
//                               <button
//                                 className="text-green-600 hover:text-green-800 px-3 py-1 border border-green-200 rounded hover:bg-green-50 transition-colors mr-2"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleApprove(appointment._id);
//                                 }}
//                               >
//                                 Approve
//                               </button>
//                               <button
//                                 className="text-red-600 hover:text-red-800 px-3 py-1 border border-red-200 rounded hover:bg-red-50 transition-colors"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleReject(appointment._id);
//                                 }}
//                               >
//                                 Reject
//                               </button>
//                             </>
//                           )}
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="4" className="text-center py-4">
//                         No appointments found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AppointmentsView;





import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Doctorsidebar from '../../components/ui/Doctorsidebar';
import Doctornavbar from '../../components/ui/Doctornavbar';
import { DoctorContext } from '../../context/DoctorContext';

const AppointmentsView = () => {
  const navigate = useNavigate();
  const { backendUrl, dToken } = useContext(DoctorContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!dToken) {
        toast.error('Authentication token is missing. Please log in again.');
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
          headers: { dtoken: dToken },
        });

        if (Array.isArray(data)) {
          setAppointments(data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        if (error.response?.status === 401) {
          toast.error('Session expired. Please log in again.');
          navigate('/login');
        } else {
          toast.error(error.response?.data?.message || 'Failed to fetch appointments');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [backendUrl, dToken, navigate]);

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
        toast.success('Appointment approved successfully');
      }
    } catch (error) {
      console.error('Error approving appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to approve appointment');
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
        toast.success('Appointment rejected successfully');
      }
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to reject appointment');
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch = appointment.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Doctorsidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Doctornavbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-semibold text-gray-900">Appointments</h1>
              <div className="mt-4 flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Search by patient name..."
                  className="flex-1 p-2 border rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  className="p-2 border rounded-md"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </header>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Appointment Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAppointments.map((appointment) => (
                      <tr key={appointment._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.user?.name || 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.user?.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {appointment.slotDate}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.slotTime}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {appointment.status === 'Pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleApprove(appointment._id)}
                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(appointment._id)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredAppointments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No appointments found
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppointmentsView