import express from 'express';
import multer from 'multer';
import doctorModel from '../models/doctorModel.js';
import bcrypt from 'bcrypt';
import fs from 'fs';
import { doctorList, loginDoctor, appointmentsDoctor, appointmentCancel, appointmentComplete, approveAppointment, rejectAppointment} from '../controllers/doctorController.js'
import { authDoctor, verifyDoctor } from '../middlewares/authDoctor.js';
import { getDoctorDashboard } from '../controllers/doctorController.js';
import { v2 as cloudinary } from 'cloudinary';
import Appointment from '../models/appointmentModel.js';


const doctorRouter = express.Router();


// Cloudinary configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// })


// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/temp';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

doctorRouter.post('/apply-doctor', upload.fields([{ name: 'certification' }, { name: 'photo' }]), async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      addressLine1,
      addressLine2,
      licenseNumber,
    } = req.body;

    // Check if doctor already exists
    const existingDoctor = await doctorModel.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor with this email already exists' });
    }

    // Upload photo to Cloudinary
    let photoUrl = '';
    if (req.files.photo) {
      const photo = req.files.photo[0];
      const uploadResult = await cloudinary.uploader.upload(photo.path, {
        folder: 'doctor_photos',
      });
      photoUrl = uploadResult.secure_url;

      // Remove temp file
      fs.unlinkSync(photo.path);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save doctor to the database
    const newDoctor = new doctorModel({
      name,
      email,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: { addressLine1, addressLine2 },
      licenseNumber,
      certification: req.files.certification ? req.files.certification[0].path : '',
      photo: photoUrl,
      date: new Date().toISOString(),
    });

    await newDoctor.save();
    res.status(201).json({ message: 'Application submitted! Pending approval.' });
  } catch (error) {
    console.error('Error saving doctor application:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})


doctorRouter.get('/me', authDoctor, async (req, res) => {
    try {
        const doctor = await doctorModel.findById(req.body.docId); // Use `req.body.docId` set by `authDoctor`
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.json({ name: doctor.name, email: doctor.email }); // Ensure 'name' is returned
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})


doctorRouter.get('/list',doctorList )
doctorRouter.post('/login', loginDoctor)
doctorRouter.get('/appointments', verifyDoctor, appointmentsDoctor)

doctorRouter.put('/appointments/:id/approve', verifyDoctor, approveAppointment);
doctorRouter.delete('/appointments/:id/reject', verifyDoctor, rejectAppointment);

doctorRouter.post('/complete-appointment', authDoctor, appointmentComplete)
doctorRouter.post('/cancel-appointment', authDoctor, appointmentCancel)
doctorRouter.get('/dashboard', verifyDoctor, getDoctorDashboard);

// Get appointments for logged in doctor
doctorRouter.get('/my-appointments', authDoctor, async (req, res) => {
    try {
        const appointments = await appointmentModel.find({ docId: req.body.docId })
            .populate('userId', 'name')
            .sort({ date: -1 });

        if (!appointments) {
            return res.status(404).json({ success: false, message: 'No appointments found' });
        }

        res.status(200).json({ success: true, appointments });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

doctorRouter.put('/appointment/:id', authDoctor, async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default doctorRouter;
