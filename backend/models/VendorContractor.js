const mongoose = require("mongoose");
const { Schema } = mongoose;
const { baseOptions, othersField } = require("../shared/common");

const VendorContractorSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["VENDOR", "CONTRACTOR"], required: true, index: true },
    // Natural key. Unique index (Mongo's real primary key stays _id).
    contactNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      set: (v) => (typeof v === "string" ? v.replace(/[\s-]/g, "") : v), // "98300 12345" == "9830012345"
      match: [/^\+?[0-9]{7,15}$/, "Invalid contact number"],
    },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    others: othersField,
  },
  baseOptions
);

VendorContractorSchema.index({ name: "text" });

module.exports = mongoose.model("VendorContractor", VendorContractorSchema);
