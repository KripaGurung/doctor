import axios from 'axios';
import React, { useState, useContext } from 'react';
import { AdminContext } from '../context/AdminContext.jsx';
import { data } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { assets } from '../assets/assets';

const Login = () => {
    const [state, setState] = useState('Admin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { setAToken, backendUrl } = useContext(AdminContext);

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
          if (state === 'Admin') {
            const response = await axios.post(backendUrl + '/api/admin/login', { email, password });
            console.log('Response:', response);

            if (response.data.success) {
                localStorage.setItem('aToken', response.data.token);
                console.log('Token:', response.data.token);
                setAToken(response.data.token);
            } else{
              toast.error(response.data.message || 'Invalid credentials');
            }
          } else {

          }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred. Please try again.');
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
            <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg ">
                <p className="text-2xl font-semibold m-auto">
                    <span className="text-primary"> {state} </span> Login
                </p>
                <div className="w-full">
                    <p>Email</p>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className="border border-[#DADADA] rounded w-full p-2 mt-1"
                        type="email"
                        required
                    />
                </div>
                <div className="w-full">
                    <p>Password</p>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className="border border-[#DADADA] rounded w-full p-2 mt-1"
                        type="password"
                        required
                    />
                </div>
                <button className="bg-primary text-white w-full py-2 rounded-md text-base"> Login</button>
            </div>
        </form>
    );
};

export default Login;