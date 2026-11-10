import mongoose from "mongoose"
const { Schema } = mongoose;
const oid = Schema.Types.ObjectId;
import { baseOptions, othersField, AttachmentSchema } from "../../../shared/common.js";


const TenderSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, enum: ["GOVT", "PVT"], required: true },
    description: String,
    client: { type: oid, ref: "Client", required: true, index: true }, // replaces PartyType + PartyName
    // File Vaults
    tenderDocs: [AttachmentSchema],        // Initial bidding specs uploaded by Sales
    applicationDocs: [AttachmentSchema],   // Bid documents produced by CEO
    poDocs: [AttachmentSchema],            // Winning Purchase Orders uploaded by Sales
    status: {
      type: String,
      enum: ["PENDING", "APPLIED", "PO_ISSUED", "LIVE", "REJECTED"],
      default: "PENDING",
      index: true,
    },
    // project: { type: oid, ref: "Project" }, // set when the tender goes LIVE
    others: othersField,
  },
  baseOptions
);

TenderSchema.index({ title: "text", code: "text" });
TenderSchema.index({ status: 1, createdAt: -1 });

// module.exports = mongoose.model("Tender", TenderSchema);
export default mongoose.model("Tender", TenderSchema);
