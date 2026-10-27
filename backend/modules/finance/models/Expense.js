const mongoose = require("mongoose");
const { Schema } = mongoose;
const oid = Schema.Types.ObjectId;
const { baseOptions, othersField, paise, AttachmentSchema } = require("../shared/common");
const { PAY_MODES } = require("../shared/constants");

const ExpenseSchema = new Schema(
  {
    date: { type: Date, required: true },
    category: { type: String, required: true, trim: true },
    amount: paise({ required: true }),
    description: String,
    attachments: [AttachmentSchema],
    project: { type: oid, ref: "Project" },       // optional
    paymentMode: { type: String, enum: PAY_MODES },
    createdBy: { type: oid, ref: "User", required: true },
    others: othersField,
  },
  baseOptions
);

ExpenseSchema.index({ date: -1 });                // daily view
ExpenseSchema.index({ project: 1, date: -1 });
ExpenseSchema.index({ category: 1, date: -1 });

module.exports = mongoose.model("Expense", ExpenseSchema);
