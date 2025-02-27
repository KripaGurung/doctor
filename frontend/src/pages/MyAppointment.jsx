import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const MyAppointment = () => {
  const { doctors } = useContext(AppContext);

  return (
    <div className="p-6 bg-light-blue-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-blue-800">My Appointments</h2>

      <div className="space-y-6">
        {doctors.slice(0, 2).map((item, index) => (
          <div
            key={index}
            className="bg-light-blue-200 shadow-lg rounded-2xl p-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-6">
              <img
                src={item.image}
                alt={item.name}
                className="w-40 h-40 object-cover rounded-full"
              />

              <div>
                <h3 className="text-xl font-semibold text-blue-900">{item.name}</h3>
                <p className="text-blue-700">{item.speciality}</p>
                <div className="mt-2 text-sm text-blue-800">
                  <p className="font-medium">Address:</p>
                  <p>{item.address.line1}</p>
                  <p>{item.address.line2}</p>
                </div>
                <p className="mt-4 text-sm">
                  <span className="font-medium text-blue-900">Date & Time:</span> 30 Feb, 2024 | 9:30 PM
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Pay Online
              </button>
              <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                Cancel Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointment