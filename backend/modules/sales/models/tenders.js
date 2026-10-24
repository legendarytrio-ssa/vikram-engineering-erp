import mongoose from "mongoose";

const attributeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false } // Prevents Mongoose from creating independent IDs for every attribute
);

const tenderSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    ceoName: { type: String, required: true, trim: true },
    title: { type: String, default: "", trim: true },
    referenceNo: { type: String, default: "", trim: true },
    submissionDate: { type: Date },
    notes: { type: String, default: "" },
    attributes: [attributeSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Tender", tenderSchema);