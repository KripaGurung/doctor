import doctorModel from "../models/doctorModel.js"
import appointmentModel from "../models/appointmentModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js';
import Report from '../models/ReportModel.js';
import Feedback from '../models/FeedbackModel.js';




const changeAvailabilty = async (req, res) => {
    try {
        
        const {docId} = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, {available : !docData.available})
        res.json({success:true, message:'Availabilty Changed'})

        
    } catch (error) {
        
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const doctorList = async (req,res)=> {

    try {
        const doctors = await doctorModel.find({}).select(['-password','-email'])
    res.json({success:true, doctors})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
    
}

// API for the docotr Login

const loginDoctor = async (req, res) =>{
    try {

        const {email, password } = req.body
        const doctor = await doctorModel.findOne({email})

        if (!doctor) {
            return res.json({success:false, message: 'Invalid credentials'})
        }

        const isMatch = await bcrypt.compare(password, doctor.password)
        if(isMatch){
            const token = jwt.sign({id:doctor._id}, process.env.JWT_SECRET)

            res.json({success:true, token})
        }else{
            res.json({success:false, message: 'Invalid credentials'})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//  // API to get dashboard data for doctor panel

//  const appointmentsDoctor = async (req, res) => {
//     try {
//         const docId = req.body.docId; // Get doctor ID from auth middleware

//         // Fetch appointments for the doctor
//         const appointments = await appointmentModel.find({ docId })
//             .populate('userId', 'name email')
//             .sort({ date: -1 });

//         if (!appointments) {
//             return res.json({ success: false, message: 'No appointments found' });
//         }

//         // Format appointments for response
//         const formattedAppointments = appointments.map(appointment => ({
//             id: appointment._id,
//             date: appointment.slotDate,
//             time: appointment.slotTime,
//             patient: appointment.userData.name,
//             status: appointment.status,
//             reason: appointment.reason
//         }));

//         res.json(formattedAppointments);
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// };


const appointmentsDoctor = async (req, res) => {
  try {
    const doctorId = req.doctor._id; // From auth middleware

    const appointments = await appointmentModel.find({ 
      doctor: doctorId 
    })
    .populate('user', 'name email') // Populate user details
    .sort({ slotDate: -1, slotTime: -1 });

    const formattedAppointments = appointments.map(appointment => ({
      _id: appointment._id,
      user: {
        name: appointment.user.name,
        email: appointment.user.email
      },
      slotDate: appointment.slotDate,
      slotTime: appointment.slotTime,
      status: appointment.status,
      reason: appointment.reason || 'General Consultation'
    }));

    res.status(200).json(formattedAppointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
}

//Api to mark appointment completeted for docotr panel

// Approve appointment endpoint
const approveAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { status: 'Confirmed' },
      { new: true }
    ).populate('user', 'name email');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Appointment approved successfully',
      appointment 
    });
  } catch (error) {
    console.error('Error approving appointment:', error);
    res.status(500).json({ success: false, message: 'Failed to approve appointment' });
  }
}

// Reject appointment endpoint
const rejectAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Delete the appointment when rejected
    await appointmentModel.findByIdAndDelete(appointmentId);

    res.status(200).json({ 
      success: true, 
      message: 'Appointment rejected successfully' 
    });
  } catch (error) {
    console.error('Error rejecting appointment:', error);
    res.status(500).json({ success: false, message: 'Failed to reject appointment' });
  }
}


const appointmentComplete = async (req, res) =>{

    try{

        const {docId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if(appointmentData && appointmentData.docId === docId) {

            await appointmentModel.findByIdAndUpdate(appointmentId, {isCompleted : true})
            return res.json({success:true,message:'Appointment Completed'})

        } else{
            return res.json({success:false,message:'Marked failed'})
        }
    }catch (error){
        console.log(error)
        return res.json({success:false,message:error.message})
    }
}


//Api to cancel appointment  for docotr panel


const appointmentCancel = async (req, res) =>{

    try{

        const {docId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if(appointmentData && appointmentData.docId === docId) {

            await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled : true})
            return res.json({success:true,message:'Appointment Cancelled'})

        } else{
            return res.json({success:false,message:'Cancellation Failed'})
        }
    }catch (error){
        console.log(error)
        return res.json({success:false,message:error.message})
    }
}

// API to get appointments for doctor panel

const getDoctorDashboard = async (req, res) => {
  try {
    const doctorId = req.doctor._id;

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointments = await appointmentModel.find({
      docId: doctorId,
      slotDate: today.toISOString().split('T')[0]
    });

    const urgentCasesCount = todayAppointments.filter(app => app.isUrgent).length;

    const upcomingAppointments = await appointmentModel.find({
      docId: doctorId,
      slotDate: { $gte: today.toISOString().split('T')[0] }
    }).limit(5);

    const totalPatients = await userModel.countDocuments({ doctor: doctorId });

    const thisMonth = new Date();
    thisMonth.setDate(1);
    const newPatientsThisMonth = await userModel.countDocuments({
      doctor: doctorId,
      createdAt: { $gte: thisMonth }
    });

    const pendingReports = await Report.find({
      doctor: doctorId,
      isSubmitted: false
    });

    const feedbacks = await Feedback.find({ doctor: doctorId });

    const avgRating = feedbacks.length
      ? feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length
      : 0;

    res.json({
      doctorName: req.doctor.name,
      todayAppointmentsCount: todayAppointments.length,
      urgentCasesCount,
      totalPatients,
      newPatientsThisMonth,
      pendingReports: pendingReports.length,
      upcomingAppointments,
      averageRating: avgRating.toFixed(1),
      recentFeedbacks: feedbacks.slice(-3).reverse() // last 3 feedbacks
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}





export {changeAvailabilty, doctorList, loginDoctor, appointmentsDoctor, appointmentCancel, appointmentComplete, getDoctorDashboard,approveAppointment, rejectAppointment}