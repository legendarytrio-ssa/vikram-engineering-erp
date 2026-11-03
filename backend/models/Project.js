const mongoose = require("mongoose");
const { Schema } = mongoose;
const oid = Schema.Types.ObjectId;
const { baseOptions, othersField, AttachmentSchema } = require("../shared/common");

const ProjectSchema = new Schema(
  {
    // ---------------------------------------------------
    // 1. CORE PROJECT DETAILS
    // ---------------------------------------------------
    projectCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
    projectName: { type: String, required: true, trim: true },
    tender: { type: oid, ref: "Tender", required: true, unique: true }, // one tender -> one project
    client: { type: oid, ref: "Client", required: true, index: true },
    status: {
      type: String,
      enum: ["ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"],
      default: "ACTIVE",
      index: true,
    },
    createdBy: { type: oid, ref: "User", required: true },

    // ---------------------------------------------------
    // 2. SALES DEPARTMENT
    // ---------------------------------------------------
    salesData: {
      poDescription: String,
      // Sales Document Vault (Contracts, Handover notes, POs from client)
      documents: [AttachmentSchema], 
    },

    // ---------------------------------------------------
    // 3. OPERATIONS DEPARTMENT
    // ---------------------------------------------------
    operationsData: {
      // QC Document Vault (Site Surveys, Drawings, Inspection Logs)
      qcDocuments: [AttachmentSchema],       
      
      // Purchase Document Vault (Vendor Quotes, Material Approvals)
      purchaseDocuments: [AttachmentSchema], 
    },

    // ---------------------------------------------------
    // 4. FINANCE DEPARTMENT
    // ---------------------------------------------------
    financeData: {
      // Finance Document Vault (Final Invoices, Tax receipts)
      documents: [AttachmentSchema], 
    },

    // ---------------------------------------------------
    // 5. MISCELLANEOUS
    // ---------------------------------------------------
    others: othersField,
  },
  { 
    ...baseOptions, 
    toJSON: { flattenMaps: true, virtuals: true }, 
    toObject: { flattenMaps: true, virtuals: true } 
  }
);

// ---------------------------------------------------
// VIRTUALS (Relations to child schemas)
// ---------------------------------------------------
// The project never stores arrays of their ids; populate them when needed:
// Project.findById(id).populate("qualityRecords").populate("purchaseItems")
ProjectSchema.virtual("qualityRecords", { ref: "QualityControl", localField: "_id", foreignField: "project" });
ProjectSchema.virtual("purchaseItems", { ref: "ItemPurchase", localField: "_id", foreignField: "project" });

module.exports = mongoose.model("Project", ProjectSchema);