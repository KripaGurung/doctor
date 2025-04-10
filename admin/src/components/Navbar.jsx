import React, { useContext, useState } from 'react'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import { useNavigate } from 'react-router-dom'
import { FiSearch, FiUser } from 'react-icons/fi'
import { Bell, Settings, X, Check } from 'lucide-react'
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "./ui/dialog";
import { toast } from "sonner";
import ChangePassword from './ChangePassword';

const Navbar = () => {
    const { aToken, setAToken } = useContext(AdminContext)
    const { dToken, setDToken } = useContext(DoctorContext)
    const navigate = useNavigate()

    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "New Appointment",
            message: "Dr. Emily Brown has a new appointment",
            time: "10 minutes ago",
            read: false
        },
        {
            id: 2,
            title: "Doctor Application",
            message: "New doctor application received from Dr. Michael Clark",
            time: "1 hour ago",
            read: false
        },
        {
            id: 3,
            title: "System Update",
            message: "System maintenance scheduled for tonight",
            time: "2 hours ago",
            read: true
        },
        {
            id: 4,
            title: "Patient Request",
            message: "New patient registration needs approval",
            time: "3 hours ago",
            read: false
        },
        {
            id: 5,
            title: "Doctor Available",
            message: "Dr. Sarah Wilson is now available for appointments",
            time: "4 hours ago",
            read: false
        }
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

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

    const logout = () => {
        navigate('/')
        if (aToken) {
            setAToken('')
            localStorage.removeItem('aToken')
        }
        if (dToken) {
            setDToken('')
            localStorage.removeItem('dToken')
        }
    }

    return (
        <>
            <div className="flex justify-between items-center px-6 sm:px-10 py-4 border-b bg-white">
                {/* Left - Title */}
                <div>
                    <h1 className="text-lg font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="text-xs text-gray-500">Welcome back, Admin</p>
                </div>

                {/* Middle - Search Bar */}
                <div className="hidden md:flex items-center border rounded-full px-3 py-1.5 shadow-sm bg-gray-50 focus-within:ring-2 focus-within:ring-blue-200">
                    <FiSearch className="text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="outline-none bg-transparent text-sm w-48"
                    />
                </div>

                {/* Right - Notifications, Settings, Profile */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <button 
                        className="relative p-2 rounded-full hover:bg-gray-100"
                        onClick={() => setNotificationsOpen(true)}
                    >
                        <Bell className="h-5 w-5 text-gray-600" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Settings */}
                    <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                        <DialogTrigger asChild>
                            <button className="p-2 rounded-full hover:bg-gray-100">
                                <Settings className="h-5 w-5 text-gray-600" />
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md" aria-describedby="password-description">
                            <DialogHeader>
                                <DialogTitle>Change Password</DialogTitle>
                                <DialogDescription id="password-description">
                                    Update your account password here. Please make sure to use a strong password.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="py-4">
                                <ChangePassword />
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Profile Info */}
                    <div className="flex items-center gap-2 text-xs">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            <FiUser />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{aToken ? 'Admin' : 'Doctor'}</span>
                    </div>

                    <button onClick={logout} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-1.5 rounded-full hidden sm:block transition-colors">
                        Logout
                    </button>
                </div>
            </div>

            {/* Notifications Panel */}
            {notificationsOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    <div className="absolute inset-0 bg-black bg-opacity-30" onClick={() => setNotificationsOpen(false)} />
                    <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-xl transform transition-transform duration-300">
                        <div className="h-full flex flex-col">
                            {/* Header */}
                            <div className="p-4 border-b flex items-center bg-white sticky top-0">
                                <button 
                                    onClick={() => setNotificationsOpen(false)}
                                    className="p-1.5 hover:bg-gray-100 rounded-full mr-3"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                                <div>
                                    <h2 className="text-lg font-semibold">All Notifications</h2>
                                    <p className="text-sm text-gray-500">View and manage all your notifications</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-4 border-b bg-gray-50">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={markAllAsRead}
                                    className="w-full"
                                >
                                    Mark all as read
                                </Button>
                            </div>

                            {/* Notifications List */}
                            <div className="flex-1 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    <div className="divide-y">
                                        {notifications.map((notification) => (
                                            <div 
                                                key={notification.id}
                                                className={`p-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h3 className="font-medium text-sm">{notification.title}</h3>
                                                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                                        <span className="text-xs text-gray-500 mt-1 block">{notification.time}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 ml-4">
                                                        {!notification.read && (
                                                            <button
                                                                onClick={() => markAsRead(notification.id)}
                                                                className="text-blue-600 hover:text-blue-800 p-1"
                                                                title="Mark as read"
                                                            >
                                                                <Check className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => deleteNotification(notification.id)}
                                                            className="text-gray-400 hover:text-red-600 p-1"
                                                            title="Remove notification"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        <p>No notifications</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t bg-gray-50 mt-auto">
                                <Button 
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                    onClick={() => setNotificationsOpen(false)}
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Navbar;
