import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen w-full flex flex-col bg-cover bg-center bg-no-repeat" 
    >
      <div className="min-h-screen w-full bg-white/90 flex flex-col justify-center items-center">

        {/* Hero Section */}
        <div className="text-center max-w-3xl px-8">
          <h1 className="text-6xl font-extrabold text-blue-900 leading-tight">Your Health, Our Priority</h1>
          <p className="text-xl text-gray-700 mt-6">
            Book appointments with top doctors from the comfort of your home. Quality healthcare, anytime, anywhere.
          </p>
        </div>

        {/* Role Selection */}
        <div className="flex flex-wrap justify-center gap-10 mt-20 w-full max-w-5xl">
          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col items-center text-center p-10 w-80 border border-gray-200 hover:shadow-blue-400 transition-shadow">
            <img src={assets.patient} alt="Patient" className="w-40 h-40 object-cover rounded-full mb-6 border-4 border-blue-100" />
            <h2 className="text-3xl font-bold text-gray-900">Patient Portal</h2>
            <p className="text-gray-600 mt-4">Book appointments, access records, and consult doctors.</p>
            <button
              className="mt-6 px-8 py-3 bg-green-600 text-white text-lg rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105"
              onClick={() => navigate("/patient-login")}
            >
              Login as Patient
            </button>
          </div>

          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col items-center text-center p-10 w-80 border border-gray-200 hover:shadow-blue-400 transition-shadow">
            <img src={assets.dd} alt="Doctor" className="w-40 h-40 object-cover rounded-full mb-6 border-4 border-blue-100" />
            <h2 className="text-3xl font-bold text-gray-900">Join as Doctor</h2>
            <p className="text-gray-600 mt-4">Join to provide care and manage patients.</p>
            <button
              className="mt-6 px-8 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
              onClick={() => navigate("/doctor-apply")}
            >
              Apply as Doctor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
