import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import KhaltiCheckout from "khalti-checkout-web";

const MyAppointment = () => {
  const { doctors } = useContext(AppContext);
  const [paymentMethod, setPaymentMethod] = useState(null);

  // Khalti Payment Config
  const khaltiConfig = {
    publicKey: "2e93b617f57d4a4e9e992692320bc6e1", // Replace with your Khalti Public Key
    productIdentity: "1234567890",
    productName: "Doctor appointment system",
    productUrl: "http://localhost:3000/",
    eventHandler: {
      onSuccess(payload) {
        console.log("Payment Successful", payload);
        alert("Khalti Payment successful! Appointment confirmed.");
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
    khaltiCheckout.show({ amount: 1000 }); // Amount in Paisa (1000 = Rs.10)
  };

  // eSewa Payment Function
  const handleEsewaPayment = () => {
    const amount = 10; // Rs.10
    const url = `https://esewa.com.np/epay/main?amt=${amount}&psc=0&pdc=0&txAmt=0&tAmt=${amount}&pid=1234567890&scd=your_esewa_merchant_id&su=http://localhost:3000/payment-success&fu=http://localhost:3000/payment-failed`;
    window.location.href = url;
  };

  const handlePayment = (method) => {
    setPaymentMethod(method);
    if (method === "Khalti") {
      handleKhaltiPayment();
    } else if (method === "eSewa") {
      handleEsewaPayment();
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
              <button
                onClick={() => setPaymentMethod("select")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Pay Online
              </button>
              <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                Cancel Appointment
              </button>
            </div>
          </div>
        ))}
      </div>

      {paymentMethod === "select" && (
        <div className="mt-6 p-4 bg-white shadow-lg rounded-lg text-center">
          <h3 className="text-lg font-semibold mb-4">Choose Payment Method</h3>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handlePayment("Khalti")}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Pay with Khalti
            </button>
            <button
              onClick={() => handlePayment("eSewa")}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Pay with eSewa
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointment;
