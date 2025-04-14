import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  name: String,
  email: String,
  registeredDate: { type: Date, default: Date.now },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor' }
});

export default mongoose.model('user', patientSchema);
