import mongoose from "mongoose"
const { Schema } = mongoose;
import { baseOptions, othersField } from "../../../shared/common.js";

const ClientSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["GOVT", "PVT"], required: true, index: true },
    contactNo: { type: String, required: true, trim: true },
    organisationCEO: { type: String, trim: true },
    others: othersField,
  },
  baseOptions
);

ClientSchema.index({ name: "text", organisationCEO: "text" }); // "search existing client, else create"

export default mongoose.model("Client", ClientSchema);
