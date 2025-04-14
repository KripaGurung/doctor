import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import moment from 'moment';

const AppointmentsList = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useSelector((state) => state.user);

    useEffect(() => {
        getAppointments();
    }, []);

    const getAppointments = async () => {
        try {
            const res = await axios.get('/api/doctor/my-appointments', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setAppointments(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const updateStatus = async (appointmentId, newStatus) => {
        try {
            await axios.put(`/api/doctor/appointment/${appointmentId}`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            getAppointments();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mt-4">
            <h3>My Appointments</h3>
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Patient Name</th>
                            <th>Date & Time</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((appointment) => (
                            <tr key={appointment._id}>
                                <td>{appointment.userId.name}</td>
                                <td>{moment(appointment.date).format('MMMM Do YYYY, h:mm a')}</td>
                                <td>{appointment.status}</td>
                                <td>
                                    {appointment.status === 'pending' && (
                                        <>
                                            <button
                                                className="btn btn-success btn-sm me-2"
                                                onClick={() => updateStatus(appointment._id, 'completed')}
                                            >
                                                Mark Completed
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => updateStatus(appointment._id, 'cancelled')}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AppointmentsList;