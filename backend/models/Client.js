const mongoose = require("mongoose");
const { Schema } = mongoose;
const { baseOptions, othersField } = require("../shared/common");

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
