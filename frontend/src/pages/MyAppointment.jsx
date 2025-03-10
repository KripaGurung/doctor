import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const MyAppointment = () => {
  const { doctors } = useContext(AppContext);


  // Khalti Payment Config
  const khaltiConfig = {
    publicKey: "your_public_key_here", // Replace with your Khalti Public Key
    productIdentity: "1234567890",
    productName: "Hotel Booking",
    productUrl: "http://localhost:3000",
    eventHandler: {
      onSuccess(payload) {
        console.log("Payment Successful", payload);
        alert("Khalti Payment successful! Booking confirmed.");
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

  const khaltiCheckout = new khaltiCheckout(khaltiConfig);

  const handleKhaltiPayment = () => {
    khaltiCheckout.show({ amount: 1000 }); // Amount in Paisa (1000 = Rs.10)
  };

  // eSewa Payment Function
  const handleEsewaPayment = () => {
    const amount = 10; // Rs.10
    const url = `https://esewa.com.np/epay/main?amt=${amount}&psc=0&pdc=0&txAmt=0&tAmt=${amount}&pid=1234567890&scd=your_esewa_merchant_id&su=http://localhost:3000/payment-success&fu=http://localhost:3000/payment-failed`;
    window.location.href = url;
  };

  const userDetails = useContext(AppContext).userDetails;

  const handlePayment = (e) => {
    e.preventDefault();
    if (userDetails?.paymentMethod === "Khalti") {
      handleKhaltiPayment();
    } else if (userDetails?.paymentMethod === "esewa") {
      handleEsewaPayment();
    } else {
      alert("Please select a payment method.");
    }
  };


  return (
    <div className="p-6 bg-light-blue-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-blue-800">My Appointments</h2>

      <div className="space-y-6">
        {doctors.slice(0, 2).map((item, index) => (
          <div
            key={index}
            className="bg-light-blue-200 shadow-lg rounded-2xl p-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-6">
              <img
                src={item.image}
                alt={item.name}
                className="w-40 h-40 object-cover rounded-full"
              />

              <div>
                <h3 className="text-xl font-semibold text-blue-900">{item.name}</h3>
                <p className="text-blue-700">{item.speciality}</p>
                <div className="mt-2 text-sm text-blue-800">
                  <p className="font-medium">Address:</p>
                  <p>{item.address.line1}</p>
                  <p>{item.address.line2}</p>
                </div>
                <p className="mt-4 text-sm">
                  <span className="font-medium text-blue-900">Date & Time:</span> 30 Feb, 2024 | 9:30 PM
                </p>
              </div>
            </div>

            <div className="flex gap-4">
            <button onClick={handlePayment} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Pay Online
          </button>
              <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                Cancel Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointment