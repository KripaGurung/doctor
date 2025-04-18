import userModel from '../models/userModel.js';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

const createUserToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// API for adding user
const addUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Details!" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid Email!" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword,
            date: Date.now(),
        };

        const newUser = new userModel(userData);
        await newUser.save();

        const token = createUserToken(newUser._id);

        res.json({ success: true, message: "User added successfully!", token });
    } catch (error) {
        console.log("Error adding user:", error);
        res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
};

// API for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ success: false, message: "Missing Details!" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid Email!" });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Credentials!" });
        }

        const token = createUserToken(user._id);

        res.json({ success: true, message: "User logged in successfully!", token });
    } catch (error) {
        console.log("Error logging in user:", error);
        res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
};

// Forgot Password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Password Reset",
            text: `Click the following link to reset your password:\n${resetLink}`,
        });

        res.status(200).json({ success: true, message: "Password reset email sent!" });
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await userModel.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.status(200).json({ success: true, message: "Password reset successfully!" });
    } catch (error) {
        console.log("Error in reset password:", error);
        res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
};

// API to get user profile data
const getProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const userData = await userModel.findById(userId).select('-password');

        res.json({ success: true, userData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to book appointment
// const bookAppointment = async (req, res) => {
//     try {
//         const { docId, slotDate, slotTime, userId } = req.body;

//         const user = await userModel.findById(userId);
//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }

//         const doctor = await doctorModel.findById(docId);
//         if (!doctor) {
//             return res.status(404).json({ success: false, message: 'Doctor not found' });
//         }

//         if (doctor.slots_booked[slotDate]?.includes(slotTime)) {
//             return res.status(400).json({ success: false, message: 'Slot is already booked' });
//         }

//         if (!doctor.slots_booked[slotDate]) {
//             doctor.slots_booked[slotDate] = [];
//         }
//         doctor.slots_booked[slotDate].push(slotTime);
//         await doctor.save();

//         const appointment = new appointmentModel({
//             doctor: doctor._id,
//             user: user._id,
//             patientName: user.name,
//             reason: 'General Consultation',
//             slotDate,
//             slotTime,
//             amount: doctor.fees,
//             userData: {
//                 name: user.name,
//                 email: user.email,
//             },
//             docData: {
//                 name: doctor.name,
//                 speciality: doctor.speciality,
//                 degree: doctor.degree,
//                 address: doctor.address,
//                 image: doctor.image,
//             },
//         });

//         await appointment.save();

//         res.status(201).json({ success: true, message: 'Appointment booked successfully' });
//     } catch (error) {
//         console.error('Error booking appointment:', error);
//         res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
// };


// const bookAppointment = async (req, res) => {
//   try {
//     const { docId, slotDate, slotTime, userId } = req.body;

//     // Validate user and doctor exist
//     const user = await userModel.findById(userId);
//     const doctor = await doctorModel.findById(docId);
//     if (!user || !doctor) {
//       return res.status(404).json({ success: false, message: 'Invalid user or doctor' });
//     }

//     // Check if slot is available
//     if (doctor.slots_booked[slotDate]?.includes(slotTime)) {
//       return res.status(400).json({ success: false, message: 'Slot already booked' });
//     }

//     // Create appointment with Pending status
//     const appointment = new appointmentModel({
//       doctor: doctor._id,
//       user: user._id,
//       patientName: user.name,
//       reason: 'General Consultation',
//       slotDate,
//       slotTime,
//       status: 'Pending',
//       amount: doctor.fees,
//       userData: {
//         name: user.name,
//         email: user.email
//       },
//       docData: {
//         name: doctor.name,
//         speciality: doctor.speciality,
//         degree: doctor.degree,
//         address: doctor.address,
//         image: doctor.image
//       }
//     });

//     await appointment.save();
//     res.status(201).json({ success: true, message: 'Appointment requested successfully' });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body;
    const userId = req.user._id; // From auth middleware

    // Input validation
    if (!docId || !slotDate || !slotTime) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Find doctor and validate
    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.status(404).json({
        success: false, 
        message: 'Doctor not found'
      });
    }

    // Check if slot is already booked
    if (doctor.slots_booked?.[slotDate]?.includes(slotTime)) {
      return res.status(400).json({
        success: false,
        message: 'This slot is already booked'
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create appointment
    const appointment = new appointmentModel({
      doctor: docId,
      user: userId,
      slotDate,
      slotTime,
      status: 'Pending',
      amount: doctor.fees || 0,
      patientName: user.name,
      userData: {
        name: user.name,
        email: user.email
      },
      docData: {
        name: doctor.name,
        speciality: doctor.speciality,
        degree: doctor.degree,
        address: doctor.address,
        image: doctor.image
      }
    });

    await appointment.save();

    // Update doctor's booked slots
    await doctorModel.findByIdAndUpdate(docId, {
      $push: { [`slots_booked.${slotDate}`]: slotTime }
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment
    });

  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book appointment',
      error: error.message
    });
  }
};

// API to cancel the appointment
const cancelAppointment = async (req, res) => {
    try {
        const { userId, appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (appointmentData.user.toString() !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        const { docId, slotDate, slotTime } = appointmentData;

        const doctorData = await doctorModel.findById(docId);

        let slots_booked = doctorData.slots_booked;
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);

        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: 'Appointment Cancelled' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const listAppointment = async (req, res) => {
    try {
        const userId = req.user._id; // From auth middleware

        const appointments = await appointmentModel.find({
            user: userId,
            status: 'Confirmed'
        }).populate('doctor', 'name speciality');

        res.status(200).json({ success: true, appointments });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const listRequestedAppointments = async (req, res) => {
    try {
        const userId = req.user._id; // From auth middleware

        const appointments = await appointmentModel.find({
            user: userId,
            status: 'Pending'
        }).populate('doctor', 'name speciality');

        res.status(200).json({ success: true, requestedAppointments: appointments });
    } catch (error) {
        console.error('Error fetching requested appointments:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}


export { addUser, loginUser, forgotPassword, resetPassword, bookAppointment, listAppointment, listRequestedAppointments, getProfile, cancelAppointment }