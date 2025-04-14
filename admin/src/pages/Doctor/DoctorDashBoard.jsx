import React, { useContext, useState, useEffect } from 'react'; // Ensure useContext is imported
import axios from 'axios';
import toast from 'react-hot-toast';
import Doctorsidebar from '../../components/ui/Doctorsidebar';
import Doctornavbar from '../../components/ui/Doctornavbar';
import { DoctorContext } from '../../context/DoctorContext';

const DoctorDashboard = () => {
  const { backendUrl, dToken } = useContext(DoctorContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  

  useEffect(() => {
    const fetchData = async () => {
      if (!dToken) {
        toast.error("Please login to access the dashboard");
        return;
      }

      try {
        // Fetch dashboard data
        const { data: dashboard } = await axios.get(`${backendUrl}/api/doctor/dashboard`, {
          headers: {
            dtoken: dToken,
          },
        });
        setDashboardData(dashboard);

        // Fetch appointments for the logged-in doctor
        const { data: appointmentsData } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
          headers: {
            dtoken: dToken,
          },
        });
        setAppointments(appointmentsData); // Assuming the API returns an array of appointments
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
        } else {
          toast.error("Failed to fetch data");
        }
      }
    };

    fetchData();
  }, [backendUrl, dToken]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Doctorsidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Doctornavbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold text-medical-primary mb-2">Today's Appointments</h2>
              <div className="text-3xl font-bold">8</div>
              <p className="text-gray-500 text-sm">2 urgent cases</p>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold text-medical-primary mb-2">Total Patients</h2>
              <div className="text-3xl font-bold">243</div>
              <p className="text-gray-500 text-sm">12 new this month</p>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold text-medical-primary mb-2">Pending Reports</h2>
              <div className="text-3xl font-bold">5</div>
              <p className="text-gray-500 text-sm">Due by tomorrow</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h2 className="text-lg font-semibold text-medical-primary mb-4">Appointment Request</h2>
            <div className="space-y-3">
              {appointments.length > 0 ? (
                appointments.map((appointment, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="bg-medical-light text-medical-primary font-semibold rounded-md p-2 mr-3">
                        {appointment.time}
                      </div>
                      <div>
                        <div className="font-medium">{appointment.patient}</div>
                        <div className="text-sm text-gray-500">{appointment.reason}</div>
                      </div>
                    </div>
                    <div className="space-x-2">
  {appointment.status !== 'Confirmed' ? (
    <>
      <button
        className="px-3 py-1 text-xs bg-green-500 text-white rounded"
        onClick={() => handleApprove(appointment._id)}
      >
        Approve
      </button>
      <button
        className="px-3 py-1 text-xs bg-red-500 text-white rounded"
        onClick={() => handleReject(appointment._id)}
      >
        Reject
      </button>
    </>
  ) : (
    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
      Confirmed
    </span>
  )}
</div>

                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No appointment request</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;