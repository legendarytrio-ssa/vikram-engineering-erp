const mongoose = require("mongoose");
const { Schema } = mongoose;
const oid = Schema.Types.ObjectId;
const { baseOptions, othersField, paise, AttachmentSchema } = require("../shared/common");
const { PAY_MODES, WEEK_STARTS_ON } = require("../shared/constants");

const MONTHS = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];

const PayrollRecordSchema = new Schema(
  {
    staff: { type: oid, ref: "Staff", required: true },
    payType: { type: String, enum: ["MONTHLY", "WEEKLY"], required: true },
    // Give any date in the period as periodStart; start/end/label are normalised automatically.
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date },
    periodLabel: { type: String },
    netAmount: paise({ required: true }),
    attachments: [AttachmentSchema],
    status: { type: String, enum: ["DUE", "PAID"], default: "DUE" },
    paidOn: Date,
    paymentMode: { type: String, enum: PAY_MODES },
    referenceNo: String,                          // UTR / cheque no
    markedPaidBy: { type: oid, ref: "User" },
    ledgerEntry: { type: oid, ref: "LedgerEntry" },
    createdBy: { type: oid, ref: "User", required: true },
    others: othersField,
  },
  baseOptions
);

// one record per employee per period -> on-demand generation is idempotent
PayrollRecordSchema.index({ staff: 1, payType: 1, periodStart: 1 }, { unique: true });
// main screen: pick pay type + date, filter Due/Paid
PayrollRecordSchema.index({ payType: 1, periodStart: 1, status: 1 });

/* ---------- period resolution (dates are UTC-midnight calendar days) ---------- */
// Pass "YYYY-MM-DD" strings from the frontend to avoid IST day shifts.
PayrollRecordSchema.statics.getPeriod = function (date, payType, weekStartsOn = WEEK_STARTS_ON) {
  const d = typeof date === "string" ? new Date(`${date}T00:00:00.000Z`) : new Date(date);
  const day = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

  if (payType === "MONTHLY") {
    return {
      periodStart: new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), 1)),
      periodEnd: new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth() + 1, 0)),
      periodLabel: `${MONTHS[day.getUTCMonth()]} ${day.getUTCFullYear()}`,
    };
  }
  const periodStart = new Date(day);
  periodStart.setUTCDate(day.getUTCDate() - ((day.getUTCDay() - weekStartsOn + 7) % 7));
  const periodEnd = new Date(periodStart);
  periodEnd.setUTCDate(periodStart.getUTCDate() + 6);
  return {
    periodStart,
    periodEnd,
    periodLabel: `Week of ${periodStart.getUTCDate()} ${MONTHS[periodStart.getUTCMonth()].slice(0, 3)} ${periodStart.getUTCFullYear()}`,
  };
};

// "Classic search": date + pay type -> that period's records
PayrollRecordSchema.statics.findForDate = function (date, payType, status) {
  const { periodStart } = this.getPeriod(date, payType);
  const filter = { payType, periodStart };
  if (status) filter.status = status;
  return this.find(filter).populate("staff", "empCode empName designation").sort({ createdAt: 1 });
};

// header totals: [{ _id: "DUE"|"PAID", count, total }]
PayrollRecordSchema.statics.summarize = function (date, payType) {
  const { periodStart } = this.getPeriod(date, payType);
  return this.aggregate([
    { $match: { payType, periodStart } },
    { $group: { _id: "$status", count: { $sum: 1 }, total: { $sum: "$netAmount" } } },
  ]);
};

PayrollRecordSchema.pre("validate", function () {
  if (this.payType && this.periodStart && (this.isNew || this.isModified("periodStart") || this.isModified("payType"))) {
    Object.assign(this, this.constructor.getPeriod(this.periodStart, this.payType));
  }
  if (this.status === "PAID") {
    if (!this.paidOn) throw new Error("paidOn is required when status is PAID");
    if (!this.paymentMode) throw new Error("paymentMode is required when status is PAID");
  } else {
    this.paidOn = this.paymentMode = this.referenceNo = this.markedPaidBy = undefined; // reverted to DUE
  }
});

module.exports = mongoose.model("PayrollRecord", PayrollRecordSchema);
