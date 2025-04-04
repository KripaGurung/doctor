import { useState } from "react";
import bb from "../assets/bb.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate(); // Initialize navigate function

  const [state, setState] = useState("Login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleStateChange = (newState) => {
    setState(newState);
    setEmail("");
    setName("");
    setPassword("");
  };

  // Register User Function
  const registerUser = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/user/addUser",
        { name, email, password },
        { headers: { "Content-Type": "application/json" } } // Ensure JSON format
      );

      if (response.data.success) {
        toast.success(response.data.message); // Show success toast
        handleStateChange("Login"); // Switch to login state after successful registration
      } else {
        toast.error(response.data.message); // Show error toast
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred while registering. Please try again."
      );
    }
  };

  // Login User Function
  const loginUser = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/user/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Login Response:", response.data);

      if (response.data.success) {
        toast.success(response.data.message); // Show success toast

        // Store token in localStorage
        localStorage.setItem("token", response.data.token);

        // Redirect to home
        navigate("/home");
      } else {
        toast.error(response.data.message); // Show error toast
      }
    } catch (error) {
      console.log("Login Error:", error.response);
      toast.error(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (state === "Sign Up") {
      registerUser();
    } else {
      loginUser();
    }
  };

  const handlePasswordChange = () => {
    navigate("/forgot-password");
  }

  return (
    <div
      className="w-screen h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${bb})` }}
    >
      <div className="w-full max-w-sm bg-gray-100 rounded-lg shadow-2xl p-6 flex flex-col items-center border border-gray-300">
        <form className="flex flex-col gap-4 w-full text-gray-900 text-sm" onSubmit={handleSubmit}>
          <p className="text-2xl font-semibold text-center text-gray-900">
            {state === "Sign Up" ? "Create Account" : "Login"}
          </p>
          <p className="text-center text-gray-600">
            Please {state === "Sign Up" ? "Create Account" : "Login"} to book an appointment
          </p>

          <div className="w-full">
            <p className="font-medium">Email</p>
            <input
              className="border border-gray-400 rounded-lg w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>

          {state === "Sign Up" && (
            <div className="w-full">
              <p className="font-medium">Name</p>
              <input
                className="border border-gray-400 rounded-lg w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="Enter your name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </div>
          )}

          <div className="w-full">
            <p className="font-medium">Password</p>
            <input
              className="border border-gray-400 rounded-lg w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>

          {state === "Login" && (
            <p onClick={() => {handlePasswordChange()}} className="text-xs text-blue-600 cursor-pointer underline self-end">
              Forgot Password?
            </p>
          )}

          <button className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-lg text-base font-medium transition-all">
            {state === "Sign Up" ? "Create Account" : "Login"}
          </button>

          {state === "Sign Up" ? (
            <p className="text-xs text-center text-gray-700">
              Already have an account?{" "}
              <span
                onClick={() => handleStateChange("Login")}
                className="text-blue-600 underline cursor-pointer"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-center text-gray-700">
              Create a new account?{" "}
              <span
                onClick={() => handleStateChange("Sign Up")}
                className="text-blue-600 underline cursor-pointer"
              >
                Click here
              </span>
            </p>
          )}
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;