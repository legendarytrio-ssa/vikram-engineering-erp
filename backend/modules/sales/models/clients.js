// import mongoose from "mongoose";

// const clientSchema = new mongoose.Schema(
//   {
//     companyName: { 
//       type: String, 
//       required: true, 
//       unique: true, 
//       trim: true 
//     },
//     ceos: [
//       { 
//         type: String, 
//         required: true, 
//         trim: true 
//       }
//     ],
//     contactEmail: { type: String, default: "" },
//     phone: { type: String, default: "" },
//     address: { type: String, default: "" },
//     notes: { type: String, default: "" },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Client", clientSchema);


import mongoose from "mongoose"
const { Schema } = mongoose;
import { baseOptions, othersField } from "../../../shared/common";

const ClientSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["GOVT", "PVT"], required: true, index: true },
    contactNo: { type: String, required: true, trim: true },
    organisationCEO: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    others: othersField,
  },
  baseOptions
);

ClientSchema.index({ name: "text", organisationCEO: "text" }); // "search existing client, else create"

module.exports = mongoose.model("Client", ClientSchema);
