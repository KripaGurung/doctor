import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen w-full flex flex-col bg-cover bg-center bg-no-repeat" 
      // style={{ backgroundImage: `url(${assets.image1})` }}
    >
      {/* Overlay for better readability */}
      <div className="min-h-screen w-full bg-white/80 flex flex-col">

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto mt-32 px-6">
          <div className="md:w-1/2 text-left">
            <h2 className="text-5xl font-bold text-gray-900">Online Doctor</h2>
            <p className="text-lg text-gray-600 mt-4">
              Get medical consultations from the best doctors. Book appointments and receive care from anywhere.
            </p>
            <button className="mt-6 px-8 py-4 bg-red-500 text-white text-lg rounded-full hover:bg-red-600 transition">
              Learn More
            </button>
          </div>
        </div>

        {/* Role Selection */}
        <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl mt-16 gap-12 px-6">
          <div className="bg-white shadow-xl rounded-3xl overflow-hidden flex flex-col items-center text-center p-8 w-full max-w-lg border border-gray-200">
            <img src={assets.patient} alt="Patient" className="w-48 mb-6 rounded-lg" />
            <h2 className="text-3xl font-semibold">Patient Portal</h2>
            <p className="text-gray-600 mt-3">Book appointments, access medical records, and consult doctors.</p>
            <button
              className="mt-6 px-8 py-4 bg-green-500 text-white text-lg rounded-full hover:bg-green-600 transition"
              onClick={() => navigate("/patient-login")}
            >
              Login as Patient
            </button>
          </div>

          <div className="bg-white shadow-xl rounded-3xl overflow-hidden flex flex-col items-center text-center p-8 w-full max-w-lg border border-gray-200">
            <img src={assets.dd} alt="Doctor" className="w-48 mb-6 rounded-lg" />
            <h2 className="text-3xl font-semibold">Join as a Doctor</h2>
            <p className="text-gray-600 mt-3">Sign up to offer medical care and manage patients.</p>
            <button
              className="mt-6 px-8 py-4 bg-blue-500 text-white text-lg rounded-full hover:bg-blue-600 transition"
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
