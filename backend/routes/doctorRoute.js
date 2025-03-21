import express from 'express';
import multer from 'multer';
import doctorModel from '../models/doctorModel.js';
import bcrypt from 'bcrypt';
import fs from 'fs';

const doctorRouter = express.Router();

// Ensure the directory exists before saving files
const uploadDir = 'uploads/certifications';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); 
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/certifications'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

doctorRouter.post('/apply-doctor', upload.single('certification'), async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, addressLine1, addressLine2 } = req.body;

        console.log("Uploaded File:", req.file);

        const existingDoctor = await doctorModel.findOne({ email });
        if (existingDoctor) {
            return res.status(400).json({ message: 'Doctor with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

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
            date: new Date().toISOString(),
            certification: req.file.path, // Store file path
        });

        await newDoctor.save();
        res.status(201).json({ message: 'Application submitted! Pending approval.' });
    } catch (error) {
        console.error('Error saving doctor application:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default doctorRouter;
