const mongoose = require("mongoose");
const { Schema } = mongoose;
const { baseOptions, othersField, paise } = require("../shared/common");
const { DEPARTMENTS } = require("../shared/constants");

const StaffSchema = new Schema(
  {
    empCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
    empName: { type: String, required: true, trim: true },
    designation: { type: String, trim: true },
    dept: { type: String, enum: DEPARTMENTS },
    payType: { type: String, enum: ["SALARIED", "WAGED"], required: true }, // monthly / weekly
    baseAmount: paise({ required: true }),        // monthly salary or weekly wage
    joiningDate: { type: Date, required: true },
    leavingDate: Date,
    isActive: { type: Boolean, default: true },
    others: othersField,
  },
  baseOptions
);

StaffSchema.index({ isActive: 1, payType: 1 });   // "who needs a payroll record this period"
StaffSchema.index({ empName: "text", empCode: "text" });

module.exports = mongoose.model("Staff", StaffSchema);
