import React, { useState } from 'react';
import { Button } from './ui/button';
import { toast } from 'sonner';

const ProfileSettings = () => {
    const [formData, setFormData] = useState({
        name: 'Admin User',
        email: 'admin@example.com',
        phone: '+1 234 567 8900',
        position: 'Administrator'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically make an API call to update the profile
        toast.success('Profile updated successfully');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl">
                    AU
                </div>
                <div>
                    <h3 className="text-lg font-semibold">{formData.name}</h3>
                    <p className="text-sm text-gray-500">{formData.position}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Position</label>
                    <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <Button type="submit" className="w-full">
                    Save Changes
                </Button>
            </form>
        </div>
    );
};

export default ProfileSettings; 