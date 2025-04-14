import React, { useContext, useState, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { DoctorContext } from '../../context/DoctorContext'
import { useNavigate } from 'react-router-dom'
import { FiSearch, FiUser } from 'react-icons/fi'
import { Bell, Settings, X, Check } from 'lucide-react'
// import { Button } from "./button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogTrigger,
// } from "./dialog";
import { toast } from "sonner";
import axios from 'axios'
// import ChangePassword from './ChangePassword';

const Doctornavbar = () => {
    const { dToken, setDToken, doctorName, setDoctorName, backendUrl } = useContext(DoctorContext);
    const navigate = useNavigate();

    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "New Appointment",
            message: "You have a new appointment",
            time: "10 minutes ago",
            read: false,
        },
        {
            id: 2,
            title: "System Update",
            message: "System maintenance scheduled for tonight",
            time: "2 hours ago",
            read: true,
        },
    ]);

    useEffect(() => {
        const fetchDoctorInfo = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/doctor/dashboard`, {
                    headers: {
                        dtoken: dToken
                    }
                });
                if (response.data.success) {
                    setDoctorName(response.data.doctorName);
                }
            } catch (error) {
                console.error('Error fetching doctor info:', error);
                toast.error('Failed to fetch doctor information');
            }
        };

        if (dToken) {
            fetchDoctorInfo();
        }
    }, [dToken, backendUrl, setDoctorName]);

    const markAsRead = (id) => {
        setNotifications(notifications.map(notif => notif.id === id ? { ...notif, read: true } : notif));
        toast.success("Notification marked as read");
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(notif => ({ ...notif, read: true })));
        toast.success("All notifications marked as read");
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(notif => notif.id !== id));
        toast.success("Notification removed");
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    const logout = () => {
        setDToken('');
        localStorage.removeItem('dToken');
        navigate('/');
        toast.success("Logged out successfully");
    };

    return (
        <div className="flex justify-between items-center px-6 sm:px-10 py-4 border-b bg-white">
            {/* Search Bar */}
            {/* <div className="hidden md:flex items-center border rounded-full px-3 py-1.5 shadow-sm bg-gray-50 focus-within:ring-2 focus-within:ring-blue-200">
                <FiSearch className="text-gray-400 mr-2" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="outline-none bg-transparent text-sm w-48"
                />
            </div> */}

            {/* Right Section */}
            <div className="flex items-center gap-4 ml-auto">
                {/* Notifications */}
                <button
                    className="relative p-2 rounded-full hover:bg-gray-100"
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                    <span className="text-gray-600">🔔</span>
                    {unreadCount > 0 && (
                              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </button>

                {/* Profile Info */}
                <div className="flex items-center gap-2 text-xs">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <FiUser />
                    </div>
                    {/* Display the doctor's name */}
                    <span className="text-sm font-medium text-gray-700">
                        Dr. {doctorName || "Loading..."}
                    </span>
                </div>

                {/* Logout Button */}
                <button
                    onClick={logout}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-1.5 rounded-full hidden sm:block transition-colors"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Doctornavbar