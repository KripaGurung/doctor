import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import sendEmail from "../utils/sendEmail.js";
import userModel from "../models/userModel.js";
import appointmentModel from "../models/appointmentModel.js";
import Appointment from '../models/appointmentModel.js';
import User from '../models/userModel.js'; 

// export const getAppointments = async (req, res) => {
//   try {
//     const appointments = await Appointment.find()
//       .populate('user') // Ensure this works by registering the User model
//       .populate('doctor');
//     res.status(200).json({ success: true, appointments });
//   } catch (error) {
//     console.error('Error fetching appointments:', error);
//     res.status(500).json({ success: false, message: 'Failed to fetch appointments' });
//   }
// };


// // Configure Multer for file uploads (certifications, images)
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// API for adding a doctor
const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
    const imageFile = req.file; img // Get uploaded file
    let imageUrl = null;

    // Validate required fields
    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
      return res.status(400).json({ success: false, message: "Missing required details!" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format!" });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters!" });
    }

    // Validate and parse address
    let parsedAddress;
    try {
      parsedAddress = JSON.parse(address);
    } catch (err) {
      return res.status(400).json({ success: false, message: "Invalid address format!" });
    }

    // Upload image to Cloudinary if provided
    if (imageFile) {
      try {
        const uploadedImage = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        imageUrl = uploadedImage.secure_url;
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        return res.status(500).json({ success: false, message: "Image upload failed!" });
      }
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new doctor entry
    const newDoctor = new doctorModel({
      name,
      email,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: parsedAddress,
      image: imageUrl,
      date: Date.now(),
    });

    // Save doctor to database
    await newDoctor.save();

    res.status(201).json({ success: true, message: "Doctor added successfully!" });
  } catch (error) {
    console.error("Error adding doctor:", error);
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
};

// Admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "24h" });
      return res.json({ success: true, token });
    }

    res.json({ success: false, message: "Invalid credentials!" });
  } catch (error) {
    console.error("Error in admin login:", error);
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
};

// Fetching all doctors
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find(); // Fetch all doctors from the database
    res.status(200).json({ success: true, doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ success: false, message: "Failed to fetch doctors" });
  }
};

// Doctor appling for approval
const applyDoctor = async (req, res) => {
  try {
    const { name, email, speciality, degree, experience, about, fees, addressLine1, addressLine2, licenseNumber } = req.body;
    const certificationFile = req.file?.certification; // Check for certification upload
    let certificationUrl = "";

    if (certificationFile) {
      const uploadedCert = await cloudinary.uploader.upload(certificationFile.path, { resource_type: "image" });
      certificationUrl = uploadedCert.secure_url;
    }

    // Create new doctor application
    const newDoctorApplication = new doctorModel({
      name,
      email,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: { line1: addressLine1, line2: addressLine2 },
      certification: certificationUrl,
      licenseNumber,
      approved: false,
    });

    await newDoctorApplication.save();
    res.status(201).json({ success: true, message: "Doctor application submitted. Pending admin approval." });
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).json({ success: false, message: "Error submitting application" });
  }
};

// Fetch all pending doctor applications
const getPendingDoctors = async (req, res) => {
  try {
    const pendingDoctors = await doctorModel.find({ approved: false });
    res.status(200).json({ success: true, doctors: pendingDoctors });
  } catch (error) {
    console.error("Error fetching pending doctors:", error);
    res.status(500).json({ success: false, message: "Error fetching pending applications" });
  }
};




// approving doctor application
const approveDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const doctor = await doctorModel.findById(doctorId);

    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });

    // Set default values for required fields if they're missing
    if (!doctor.password) {
      // Generate a random password
      const randomPassword = Math.random().toString(36).slice(-8);
      doctor.password = await bcrypt.hash(randomPassword, 10);
    }
    if (!doctor.image) doctor.image = "default-doctor-image.png";
    if (!doctor.date) doctor.date = new Date().toISOString();
    if (!doctor.slots_booked) doctor.slots_booked = {};
    if (!doctor.certification) doctor.certification = "pending-certification.jpg";
    if (!doctor.licenseNumber) doctor.licenseNumber = "pending-license";

    doctor.approved = true;
    await doctor.save();

    // Try to send approval email
    try {
      await sendEmail(
        doctor.email,
        "Application Approved",
        `<p>Dear ${doctor.name},</p>
        <p>Congratulations! Your application has been approved. You can now log in to your dashboard and start managing appointments.</p>
        <p>Best Regards,<br/>Admin Team</p>`
      );
    } catch (emailError) {
      console.error("Error sending approval email:", emailError);
      // Continue even if email fails
    }

    res.status(200).json({ success: true, message: "Doctor approved successfully" });
  } catch (error) {
    console.error("Error approving doctor:", error);
    res.status(500).json({ success: false, message: "Error approving doctor" });
  }
};

//  cancelling doctor application
const rejectDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const doctor = await doctorModel.findByIdAndDelete(doctorId);

    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });

    // Try to send rejection email, but don't fail if it doesn't work
    try {
      await sendEmail(
        doctor.email,
        "Application Rejected",
        `<p>Dear ${doctor.name},</p>
        <p>We regret to inform you that your application has been rejected.</p>
        <p>If you have any questions, please contact support.</p>
        <p>Best Regards,<br/>Admin Team</p>`
      );
    } catch (emailError) {
      console.error("Error sending rejection email:", emailError);
      // Continue with the response even if email fails
    }

    res.status(200).json({ success: true, message: "Doctor application rejected" });
  } catch (error) {
    console.error("Error rejecting doctor:", error);
    res.status(500).json({ success: false, message: "Error rejecting doctor" });
  }
}


const getDoctorCount = async (req, res) => {
  try {
    const count = await doctorModel.countDocuments(); // Count all doctors
    res.status(200).json({ success: true, count });
  } catch (error) {
    console.error("Error fetching doctor count:", error);
    res.status(500).json({ success: false, message: "Failed to fetch doctor count." });
  }
}

const getPatientCount = async (req, res) => {
  try {
    // Count all users in the database
    const count = await userModel.countDocuments();
    res.status(200).json({ success: true, count });
  } catch (error) {
    console.error("Error fetching patient count:", error);
    res.status(500).json({ success: false, message: "Failed to fetch patient count." });
  }
};

// Fetch all appointments
// const getAppointments = async (req, res) => {
//   try {
//     const appointments = await appointmentModel
//       .find()
//       .populate("userId", "name email") 
//       .populate("docId", "name email") 
//       .sort({ date: -1 }) 
//       .limit(10); 
//     res.status(200).json({ success: true, appointments });
//   } catch (error) {
//     console.error("Error fetching appointments:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch appointments" });
//   }
// }

const getAppointments = async (req, res) => {
  try {
    console.log("Fetching appointments...");
    const appointments = await appointmentModel
      .find()
      .populate("user", "name email")
      .populate("doctor", "name email")
      .sort({ date: -1 })
      .limit(10);
    console.log("Appointments fetched:", appointments);
    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ success: false, message: "Failed to fetch appointments" });
  }
}


export { addDoctor, loginAdmin, allDoctors, applyDoctor, getPendingDoctors, approveDoctor, rejectDoctor, getDoctorCount, getPatientCount, getAppointments }; 
