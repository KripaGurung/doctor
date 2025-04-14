import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image:{type:String, requried: true},
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    fees: { type: Number, required: true },
    address: { type: Object, required: true },
    date: { type: String, required: true },
    slots_booked: { type: Object, default: {} },
    licenseNumber: { type: String, required: true },

    // New Fields for Certification and Approval Process
    certification: { type: String, required: true },
    approved: { type: Boolean, default: false }, 
}, { minimize: false });

const doctorModel = mongoose.models.doctor || mongoose.model('doctor', doctorSchema);

export default doctorModel;
