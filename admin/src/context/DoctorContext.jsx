import { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    const [dToken, setDToken] = useState(localStorage.getItem('dToken') || '');
    const [doctorName, setDoctorName] = useState('');

    // Fetch doctor details if token exists
    useEffect(() => {
        const fetchDoctorDetails = async () => {
            if (dToken) {
                try {
                    const response = await axios.get(`${backendUrl}/api/doctor/me`, {
                        headers: { dtoken: dToken },
                    });
                    if (response.data && response.data.name) {
                        setDoctorName(response.data.name); // Update doctorName
                    } else {
                        console.error('Doctor name not found in response:', response.data);
                    }
                } catch (error) {
                    console.error('Failed to fetch doctor details:', error);
                    toast.error('Failed to fetch doctor details. Please log in again.');
                    setDToken('');
                    setDoctorName('');
                    localStorage.removeItem('dToken');
                }
            }
        };
    
        fetchDoctorDetails();
    }, [dToken, backendUrl]);


    // Update localStorage when token changes
    useEffect(() => {
        if (dToken) {
            localStorage.setItem('dToken', dToken);
        } else {
            localStorage.removeItem('dToken');
        }
    }, [dToken]);

    const isAuthenticated = () => {
        return !!dToken;
    };

    const loginDoctor = async (credentials) => {
        try {
            const response = await axios.post(`${backendUrl}/api/doctor/login`, credentials);
            const { token, name } = response.data; 
            setDToken(token);
            setDoctorName(name); 
            localStorage.setItem('dToken', token);
        } catch (error) {
            console.error('Login failed:', error);
            toast.error('Login failed. Please try again.');
        }
    };

    const value = {
        dToken,
        setDToken,
        backendUrl,
        isAuthenticated,
        doctorName,
        setDoctorName, 
        loginDoctor, 
    };

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    );
};

export default DoctorContextProvider