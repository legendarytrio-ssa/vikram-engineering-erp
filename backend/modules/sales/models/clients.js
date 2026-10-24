import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    companyName: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true 
    },
    ceos: [
      { 
        type: String, 
        required: true, 
        trim: true 
      }
    ],
    contactEmail: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Client", clientSchema);