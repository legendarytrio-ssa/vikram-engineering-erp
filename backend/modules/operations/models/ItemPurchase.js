const mongoose = require("mongoose");
const { Schema } = mongoose;
const oid = Schema.Types.ObjectId;
const { baseOptions, othersField, AttachmentSchema } = require("../../../shared/common");

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

module.exports = mongoose.model("ItemPurchase", ItemPurchaseSchema);