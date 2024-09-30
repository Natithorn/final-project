import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: String, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  notes: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Record = mongoose.models.Record || mongoose.model("Record", recordSchema);
export default Record;
