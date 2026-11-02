import mongoose from "mongoose";
const { Schema } = mongoose;
const oid = Schema.Types.ObjectId;
import { baseOptions, othersField, paise, AttachmentSchema } from "../../../shared/common.js";
import { PAY_MODES } from "../../../shared/constants.js";

const ExpenseSchema = new Schema(
  {
    date: { type: Date, required: true },
    category: { type: String, required: true, trim: true },
    amount: paise({ required: true }),
    description: String,
    attachments: [AttachmentSchema],
    project: { type: oid, ref: "Project" },       
    paymentMode: { type: String, enum: PAY_MODES },
    createdBy: { type: oid, ref: "User", required: true },
    others: othersField,
  },
  baseOptions
);

ExpenseSchema.index({ date: -1 });                
ExpenseSchema.index({ project: 1, date: -1 });
ExpenseSchema.index({ category: 1, date: -1 });

export default mongoose.model("Expense", ExpenseSchema);