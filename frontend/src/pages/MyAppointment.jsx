import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import KhaltiCheckout from 'khalti-checkout-web'


const MyAppointments = () => {
    const { backendUrl, token, getDoctorsData } = useContext(AppContext);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPaymentId, setSelectedPaymentId] = useState(null);

    const months = [" ", "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_');
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
    };

    const getUserAppointments = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/appointments`, { headers: { token } });
            if (data.success) {
                setAppointments(data.appointments.reverse());
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to fetch appointments');
        } finally {
            setLoading(false);
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to cancel this appointment?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, cancel it!',
                cancelButtonText: 'No, keep it'
            });

            if (result.isConfirmed) {
                const { data } = await axios.post(
                    `${backendUrl}/api/user/cancel-appointment`,
                    { appointmentId },
                    { headers: { token } }
                );

                if (data.success) {
                    toast.success(data.message);
                    getUserAppointments();
                    getDoctorsData();
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to cancel appointment');
        }
    };

    // Khalti Payment Config
    const khaltiConfig = {
        publicKey: "84d65d807f78402fb84a03a411fd849f",
        productIdentity: "1234567890",
        productName: "Doctor appointment system",
        productUrl: "http://localhost:3000/",
        eventHandler: {
            onSuccess(payload) {
                console.log("Payment Successful", payload);
                alert("Khalti Payment successful! Appointment confirmed.");
                setSelectedPaymentId(null);
            },
            onError(error) {
                console.log("Payment Error", error);
                alert("Khalti Payment failed. Try again.");
            },
            onClose() {
                console.log("Payment closed.");
            },
        },
        paymentPreference: ["KHALTI"],
    };

    const khaltiCheckout = new KhaltiCheckout(khaltiConfig);

    const handleKhaltiPayment = () => {
        khaltiCheckout.show({ amount: 1000 }); // Amount in Paisa (Rs.10)
    };

    const handleEsewaPayment = () => {
        const amount = 10;
        const url = `https://esewa.com.np/epay/main?amt=${amount}&psc=0&pdc=0&txAmt=0&tAmt=${amount}&pid=1234567890&scd=your_esewa_merchant_id&su=http://localhost:3000/payment-success&fu=http://localhost:3000/payment-failed`;
        window.location.href = url;
    };

    const handlePayment = (appointmentId, method) => {
        if (method === "Khalti") {
            handleKhaltiPayment();
        } else if (method === "eSewa") {
            handleEsewaPayment();
        }
        setSelectedPaymentId(null);
    };

    useEffect(() => {
        if (token) {
            getUserAppointments();
        }
    }, [token]);

    if (loading) return <div>Loading...</div>;



    const payWithKhalti = async () => {
        try {
            const response = await fetch(`http://localhost:4000/khalti/complete-khalti-payment`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    // Change the product id to doctor id , buyer name to patient  and amiunt
                    product_id:"12345678",buyer_name:"Kirpa",amount:200
                })
            })
            console.log('Paying with Khalti...');

            const data = await response.json();
            console.log(data);

            if (response.status===200) {       
                window.location.href = data.message; // Redirect to Khalti payment page
            }

        } catch (error) {
           console.log(error) 
        }
    }

    return (
        <div>
            <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>

            {appointments.length === 0 ? (
                <p className='text-zinc-600'>No appointments found.</p>
            ) : (
                <div>
                    {appointments.map((item, index) => (
                        <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2.5 border-b' key={index}>
                            <div>
                                <img className='w-40 bg-indigo-50' src={item.docData.image} alt={`Dr. ${item.docData.name}`} />
                            </div>

                            <div className='flex-1 text-sm text-zinc-600'>
                                <p className='text-netural-800 font-semibold'>{item.docData.name}</p>
                                <p>{item.docData.speciality}</p>
                                <p className='text-zinc-700 font-medium mt-2.5'>Address:</p>
                                <p className='text-xs'>{item.docData.address.line1}</p>
                                <p className='text-xs'>{item.docData.address.line2}</p>
                                <p className='text-xs mt-2.5'>
                                    <span className='text-sm text-netural-700 font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}
                                </p>
                            </div>

                            <div className='flex flex-col gap-2 justify-end'>
                                {!item.cancelled && (
                                    <>
                                        <button
                                            onClick={() => setSelectedPaymentId(item._id)}
                                            className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'
                                        >
                                            Pay Online
                                        </button>
                                        <button
                                            onClick={() => cancelAppointment(item._id)}
                                            className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'
                                        >
                                            Cancel Appointment
                                        </button>
                                    </>
                                )}
                                {item.cancelled && (
                                    <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>
                                        Appointment Cancelled
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Popup for Payment Method Selection */}
            {selectedPaymentId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-80 relative">
                        <button
                            onClick={() => setSelectedPaymentId(null)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                        <p className="text-lg font-medium mb-4">Choose Payment Method</p>
                        <div className="flex flex-col gap-4">
                            <button
                            onClick={()=>payWithKhalti()}
                                // onClick={() => handlePayment(selectedPaymentId, "Khalti")}
                                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                            >
                                Pay with Khalti
                            </button>
                            <button
                                onClick={() => handlePayment(selectedPaymentId, "eSewa")}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Pay with eSewa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyAppointments;
