import React, { useState } from 'react';
import { Bell, Check, X, Search } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "New Appointment",
            message: "Dr. Emily Brown has a new appointment",
            time: "10 minutes ago",
            read: false,
            type: "appointment"
        },
        {
            id: 2,
            title: "Doctor Application",
            message: "New doctor application received from Dr. Michael Clark",
            time: "1 hour ago",
            read: false,
            type: "application"
        },
        {
            id: 3,
            title: "System Update",
            message: "System maintenance scheduled for tonight",
            time: "2 hours ago",
            read: true,
            type: "system"
        },
        {
            id: 4,
            title: "New Patient Registration",
            message: "New patient registered: John Doe",
            time: "3 hours ago",
            read: true,
            type: "patient"
        }
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');

    const markAsRead = (id) => {
        setNotifications(notifications.map(notif => 
            notif.id === id ? { ...notif, read: true } : notif
        ));
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

    const filteredNotifications = notifications.filter(notif => {
        const matchesSearch = notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            notif.message.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'all' || notif.type === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Notifications</h1>
                <Button onClick={markAllAsRead} variant="outline">
                    Mark all as read
                </Button>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search notifications..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">All Types</option>
                    <option value="appointment">Appointments</option>
                    <option value="application">Applications</option>
                    <option value="system">System</option>
                    <option value="patient">Patients</option>
                </select>
            </div>

            <div className="space-y-4">
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`p-4 border rounded-lg ${!notification.read ? 'bg-blue-50' : ''}`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-100 rounded-full">
                                        <Bell className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">{notification.title}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                        <span className="text-xs text-gray-500 mt-1 block">{notification.time}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!notification.read && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => markAsRead(notification.id)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <Check className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteNotification(notification.id)}
                                        className="text-gray-400 hover:text-red-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No notifications found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage; 