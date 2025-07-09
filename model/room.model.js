import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  rent: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

const room = mongoose.model("room", roomSchema);
export default room;
