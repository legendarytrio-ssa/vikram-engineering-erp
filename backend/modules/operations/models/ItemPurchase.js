import mongoose from "mongoose";
// Note: ES modules in Node require the .js extension at the end of local imports
import { baseOptions, othersField, AttachmentSchema } from "../../../shared/common.js";

const { Schema } = mongoose;
const oid = Schema.Types.ObjectId;

const ItemPurchaseSchema = new Schema(
  {
    project: { type: oid, ref: "Project", required: true, index: true },
    
    materialName: { type: String, required: true, trim: true },
    vendorName: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true },
    uom: { type: String, required: true },
    unitRate: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    
    status: {
      type: String,
      enum: ["PO_ISSUED", "DELIVERY_PENDING", "DELIVERED", "INVOICE_APPROVED"],
      default: "PO_ISSUED",
      index: true,
    },

    // Vendor quotes, official PO PDFs, vendor invoices
    documents: [AttachmentSchema],
    
    createdBy: { type: oid, ref: "User", required: true },
    others: othersField,
  },
  { ...baseOptions }
);

// Converted to ES6 default export
export default mongoose.model("ItemPurchase", ItemPurchaseSchema);