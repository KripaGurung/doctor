import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor' },
  patientName: String,
  dueDate: Date,
  isSubmitted: { type: Boolean, default: false }
});

export default mongoose.model('Report', reportSchema);
