import mongoose from "mongoose";
const { Schema } = mongoose;
import { baseOptions, othersField, paise } from "../../../shared/common.js";
import { DEPARTMENTS } from "../../../shared/constants.js";

const StaffSchema = new Schema(
  {
    empCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
    empName: { type: String, required: true, trim: true },
    designation: { type: String, trim: true },
    dept: { type: String, enum: DEPARTMENTS },
    payType: { type: String, enum: ["SALARIED", "WAGED"], required: true },
    baseAmount: paise({ required: true }),
    joiningDate: { type: Date, required: true },
    leavingDate: Date,
    isActive: { type: Boolean, default: true },
    others: othersField,
  },
  baseOptions
);

StaffSchema.index({ isActive: 1, payType: 1 });
StaffSchema.index({ empName: "text", empCode: "text" });

export default mongoose.model("Staff", StaffSchema);