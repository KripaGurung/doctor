// import React, { useContext, useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { AppContext } from '../context/AppContext';
// import { assets } from '../assets/assets';
// import RelatedDoctors from '../components/RelatedDoctors';
// import { toast } from 'react-toastify';
// import axios from 'axios';

// const Appointment = () => {
//   const { docId } = useParams();
//   const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);
//   const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

//   const navigate = useNavigate();

//   const [docInfo, setDocInfo] = useState(null);
//   const [docSlots, setDocslots] = useState([]);
//   const [slotIndex, setSlotIndex] = useState(0);
//   const [slotTime, setSlotTime] = useState('');

//   useEffect(() => {
//     const fetchDocInfo = () => {
//       const doc = doctors?.find(doc => doc._id === docId);
//       setDocInfo(doc);
//       console.log("Doctor Info:", doc);
//     };

//     fetchDocInfo();
//   }, [doctors, docId]);

//   useEffect(() => {
//     const getAvailableSlots = () => {
//       setDocslots([]);
//       let today = new Date();

//       for (let i = 0; i < 7; i++) {
//         let currentDate = new Date(today);
//         currentDate.setDate(today.getDate() + i);

//         let endTime = new Date();
//         endTime.setDate(today.getDate() + i);
//         endTime.setHours(21, 0, 0, 0);

//         if (today.getDate() === currentDate.getDate()) {
//           currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
//           currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
//         } else {
//           currentDate.setHours(10);
//           currentDate.setMinutes(0);
//         }

//         let timeSlots = [];
//         while (currentDate < endTime) {
//           let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//           timeSlots.push({
//             datetime: new Date(currentDate),
//             time: formattedTime
//           });

//           currentDate.setMinutes(currentDate.getMinutes() + 60);
//         }
//         setDocslots(prev => [...prev, timeSlots]);
//       }
//     };

//     getAvailableSlots();
//   }, [docInfo]);

//   ///book appointment

//   const bookAppointment = async () => {
//     if (!token) {
//       toast.warn('Login to book an appointment');
//       return navigate('/login');
//     }

//     try {

//       const date = docSlots[slotIndex][0].datetime

//             let day = date.getDate()
//             let month = date.getMonth()+1
//             let year = date.getFullYear()
      
//             const slotDate = day + "_" + month + "_" + year
      
//             // console.log(slotDate);
            
//       const { data } = await axios.post(backendUrl + '/api/user/book-appointment', {docId, slotDate, slotTime},{headers: {token}})
//       if (data.success) {
//         toast.success(data.message)
//         getDoctorsData()
//         navigate('/my-appointments')
//       }else{

//         toast.error(data.message)

//       }
//     } catch (error) {
//       console.log(error)
//       //       toast.error(error.message)
//     }
//   };

//   return docInfo && (
//     <div>
//       {/* Doctor Detail */}
//       <div className='flex flex-col sm:flex-row gap-4'>
//         <div>
//           <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
//         </div>
//         {/* Doctor Info */}
//         <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
//           <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
//             {docInfo.name} <img className='w-5' src={assets.verified_icon} alt="" />
//           </p>
//           <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
//             <p>{docInfo.degree} - {docInfo.speciality}</p>
//             <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
//           </div>
//           {/* About Doctor */}
//           <div>
//             <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
//               About <img src={assets.info_icon} alt="" />
//             </p>
//             <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
//           </div>
//           <p className='text-gray-500 font-bold mt-4'>
//             Appointment fee: <span className='text-green-600'>{currencySymbol}{docInfo.fees}</span>
//           </p>
//         </div>
//       </div>

//       {/* Booking Slots */}
//       <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
//         <p>Booking slots</p>
//         <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
//           {docSlots.length > 0 && docSlots.map((item, index) => (
//             <div key={index} onClick={() => setSlotIndex(index)}
//               className={`text-center py-6 min-w-16 rounded-full cursor-pointer 
//                 ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`}>
//               <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
//               <p>{item[0] && item[0].datetime.getDate()}</p>
//             </div>
//           ))}
//         </div>
//         <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
//           {docSlots.length > 0 && docSlots[slotIndex]?.map((item, index) => (
//             <p key={index} onClick={() => setSlotTime(item.time)}
//               className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer 
//                 ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`}>
//               {item.time}
//             </p>
//           ))}
//         </div>
//         <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>
//           Book an Appointment
//         </button>
//       </div>

//       {/* Related Doctors */}
//       <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
//     </div>
//   );
// };

// export default Appointment;















// import React, { useContext, useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { AppContext } from "../context/AppContext";
// import { assets } from "../assets/assets";

// const Appointment = () => {
//   const { docId } = useParams();
//   const { doctors, currencySymbol } = useContext(AppContext);
//   const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

//   const [docInfo, setDocInfo] = useState(null);
//   const [docslots, setDocslots] = useState([]);
//   const [slotIndex, setSlotIndex] = useState(0);

//   // Fetch doctor info based on docId
//   const fetchDocInfo = async () => {
//     const docInfo = doctors?.find((doc) => doc._id === docId);
//     setDocInfo(docInfo);
//   };

//   // Generate available slots for the next 7 days
//   const getAvailableSlots = async () => {
//     setDocslots([]); // Clear previous slots
//     const today = new Date();

//     for (let i = 0; i < 7; i++) {
//       const currentDate = new Date(today);
//       currentDate.setDate(today.getDate() + i);

//       const endTime = new Date(currentDate);
//       endTime.setHours(21, 0, 0, 0); // End time for the day is 9 PM

//       if (today.getDate() === currentDate.getDate()) {
//         currentDate.setHours(
//           currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
//         );
//         currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
//       } else {
//         currentDate.setHours(10, 0, 0, 0); // Start time for other days is 10 AM
//       }

//       const timeSlots = [];
//       while (currentDate < endTime) {
//         timeSlots.push({
//           datetime: new Date(currentDate),
//           time: currentDate.toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           }),
//         });
//         currentDate.setMinutes(currentDate.getMinutes() + 60); // Increment by 1 hour
//       }

//       setDocslots((prev) => [...prev, timeSlots]);
//     }
//   };

//   // Fetch doctor info on component mount or when docId changes
//   useEffect(() => {
//     fetchDocInfo();
//   }, [doctors, docId]);

//   // Generate available slots when doctor info is fetched
//   useEffect(() => {
//     if (docInfo) {
//       getAvailableSlots();
//     }
//   }, [docInfo]);

//   // Render component
//   return (
//     docInfo && (
//       <div>
//         {/* Doctor Details */}
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div>
//             <img
//               className="bg-primary w-full sm:max-w-72 rounded-lg"
//               src={docInfo.image}
//               alt=""
//             />
//           </div>
//           {/* Doctor Info */}
//           <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
//             <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
//               {docInfo.name}
//               <img className="w-5" src={assets.verified_icon} alt="" />
//             </p>
//             <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
//               <p>
//                 {docInfo.degree} - {docInfo.speciality}
//               </p>
//               <button className="py-0.5 px-2 border text-xs rounded-full">
//                 {docInfo.experience}
//               </button>
//             </div>
//             <div>
//               <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
//                 About
//                 <img src={assets.info_icon} alt="" />
//               </p>
//               <p className="text-sm text-gray-500 max-w-[700px] mt-1">
//                 {docInfo.about}
//               </p>
//             </div>
//             <p className="text-gray-500 font-bold mt-4">
//               Appointment fee:
//               <span className="text-green-600">
//                 {currencySymbol}
//                 {docInfo.fees}
//               </span>
//             </p>
//           </div>
//         </div>

//         {/* Booking Slots */}
//         <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
//           <p>Booking slots</p>
//           <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
//             {docslots.length > 0 &&
//               docslots.map((item, index) => (
//                 <div
//                   onClick={() => setSlotIndex(index)}
//                   className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
//                     slotIndex === index
//                       ? "bg-primary text-white"
//                       : "border border-gray-200"
//                   }`}
//                   key={index}
//                 >
//                   <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
//                   <p>{item[0] && item[0].datetime.getDate()}</p>
//                 </div>
//               ))}
//           </div>

//               <div className='flex items-center gap-3 w-full overflow-x-scroll mt 4'>
//                 {docslots.length && docslots[slotIndex].map((item, index)=> (
//                   <p className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ` }key={index}>
//                     {item.time.toLowerCase()}

//                   </p>
//                 ))}
//               </div>
//         </div>
//       </div>
//     )
//   );
// };

// export default Appointment;


import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';
import DoctorReviews from '../Components/Reviews';

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token } = useContext(AppContext);
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocslots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  const fetchDocInfo = async () => {
    const docInfo = doctors?.find(doc => doc._id === docId);
    setDocInfo(docInfo);
  };

  const getAvailableSlots = async () => {
    setDocslots([]);
    let today = new Date();
    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = `${day}_${month}_${year}`;
        const slotTime = formattedTime;

        const isSlotAvailable =
          !docInfo?.slots_booked?.[slotDate] || !docInfo.slots_booked[slotDate].includes(slotTime);

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 60);
      }

      setDocslots((prev) => [...prev, timeSlots]);
    }
  };

  // const bookAppointment = async () => {
  //   if (!token) {
  //     toast.warn("Login to book an appointment");
  //     return navigate("/login");
  //   }
    
  //   if (!docSlots[slotIndex] || !slotTime) {
  //     toast.error("Please select a valid slot");
  //     return;
  //   }

  //   try {
  //     const date = docSlots[slotIndex][0].datetime;
  //     const day = date.getDate();
  //     const month = date.getMonth() + 1;
  //     const year = date.getFullYear();
  //     const slotDate = `${day}_${month}_${year}`;
    
  //     const appointmentData = {
  //       docId,
  //       slotDate,
  //       slotTime,
  //       status: 'Pending'
  //     };

  //     const { data } = await axios.post(
  //       `${backendUrl}/api/user/book-appointment`,
  //       appointmentData,
  //       { headers: { token } }
  //     );

  //     if (data.success) {
  //       toast.success(data.message);
  //       getDoctorsData();
  //       navigate('/my-appointments');
  //     }
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Failed to book appointment");
  //   }
  // }

 

const bookAppointment = async () => {
  try {
    if (!token) {
      toast.warn('Please login to book an appointment');
      return navigate('/login');
    }

    if (!slotTime || !docSlots[slotIndex]) {
      return toast.error('Please select a valid time slot');
    }

    const date = docSlots[slotIndex][0].datetime;
    const formattedDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;

    // Include all required fields 
    const requestData = {
      docId,
      slotDate: formattedDate,
      slotTime,
      patientName: '', // Add from user context/state
      reason: 'General Consultation'
    };

    const response = await axios.post(
      `${backendUrl}/api/user/book-appointment`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          token: token
        }
      }
    );

    if (response.data.success) {
      toast.success('Appointment booked successfully');
      navigate('/my-appointments');
    }
  } catch (error) {
    console.error('Booking error:', error);
    toast.error(error.response?.data?.message || 'Failed to book appointment');
  }
};

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId])

  useEffect(() => {
    getAvailableSlots()
  }, [docInfo])

  return docInfo && (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Doctor Details */}
        <div className="w-full lg:w-2/3">
          {/* Doctor Profile Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-48 flex-shrink-0">
                  <img 
                    className="w-full h-48 object-cover rounded-lg" 
                    src={docInfo.image} 
                    alt={docInfo.name} 
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-900">{docInfo.name}</h1>
                    <img className="w-5" src={assets.verified_icon} alt="Verified" />
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-gray-600">
                      {docInfo.degree} - {docInfo.speciality}
                    </p>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                      {docInfo.experience} years experience
                    </span>
                  </div>

                  <div className="mt-4">
                    <h3 className="flex items-center gap-1 text-sm font-medium text-gray-900">
                      About <img src={assets.info_icon} alt="" />
                    </h3>
                    <p className="mt-2 text-gray-600">{docInfo.about}</p>
                  </div>

                  <div className="mt-4">
                    <p className="text-gray-500 font-bold">
                      Appointment fee: <span className="text-green-600">{currencySymbol}{docInfo.fees}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Patient Reviews</h2>
            <DoctorReviews 
              doctorId={docId} 
              backendUrl={backendUrl}
            />
          </div>
        </div>

        {/* Right Column - Booking Slots */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Book Appointment</h2>
            
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Select Date</p>
              <div className="flex gap-3 items-center w-full overflow-x-auto pb-2">
                {docSlots.length > 0 && docSlots.map((item, index) => (
                  <div
                    onClick={() => setSlotIndex(index)}
                    className={`text-center py-4 min-w-16 rounded-lg cursor-pointer transition-colors ${
                      slotIndex === index 
                        ? "bg-primary text-white" 
                        : "border border-gray-200 hover:bg-gray-50"
                    }`}
                    key={index}
                  >
                    <p className="text-xs font-medium">{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                    <p className="text-sm font-semibold">{item[0] && item[0].datetime.getDate()}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Available Time Slots</p>
              <div className="grid grid-cols-3 gap-3">
                {docSlots[slotIndex]?.map((item, index) => (
                  <button
                    onClick={() => setSlotTime(item.time)}
                    className={`py-2 px-3 rounded-md text-sm transition-colors ${
                      item.time === slotTime 
                        ? "bg-primary text-white" 
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                    key={index}
                  >
                    {item.time.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={bookAppointment}
              disabled={!slotTime}
              className={`w-full py-3 rounded-md text-white font-medium transition-colors ${
                slotTime ? "bg-primary hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointment;