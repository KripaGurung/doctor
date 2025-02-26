import { useState } from "react";
import bb from "../assets/bb.jpg";
import axios from "axios";

const Login = () => {
  const [state, setState] = useState("Login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleStateChange = (newState) => {
    setState(newState);
    setEmail("");
    setName("");
    setPassword("");
    setError("");
    setSuccess("");
  };

  const registerUser = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/user/addUser', { name, email, password });
      if (response.data.success) {
        setSuccess(response.data.message);
        setError("");
      } else {
        setError(response.data.message);
        setSuccess("");
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred while registering. Please try again.");
      setSuccess("");
    }
  };

  const loginUser = async () => {
    try {
      const response = await axios.post('/api/users/login', { email, password });
      if (response.data.success) {
        setSuccess(response.data.message);
        setError("");
      } else {
        setError(response.data.message);
        setSuccess("");
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred while logging in. Please try again.");
      setSuccess("");
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

          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}

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
            <p className="text-xs text-blue-600 cursor-pointer underline self-end">
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
    </div>
  );
};

export default Login;