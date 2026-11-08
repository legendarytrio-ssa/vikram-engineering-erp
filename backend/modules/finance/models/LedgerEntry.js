import mongoose from "mongoose";
const { Schema } = mongoose;
const oid = Schema.Types.ObjectId;
import { baseOptions, othersField, paise } from "../../../shared/common.js";
import { PAY_MODES } from "../../../shared/constants.js";

const LedgerEntrySchema = new Schema(
  {
    date: { type: Date, required: true, default: Date.now },
    particulars: { type: String, required: true, trim: true },
    project: { type: oid, ref: "Project" },
    amount: paise({ required: true, min: 1 }),
    type: { type: String, enum: ["DEBIT", "CREDIT"], required: true },

    account: {
      model: { type: String, enum: ["VendorContractor", "Client", "Staff"] },
      ref: { type: oid, refPath: "account.model" },
    },

    source: {
      kind: { type: String, enum: ["ITEM_PURCHASE", "PAYROLL", "EXPENSE", "CLIENT_RECEIPT", "MANUAL"], required: true },
      ref: oid,
    },
    paymentMode: { type: String, enum: PAY_MODES },
    referenceNo: String,
    createdBy: { type: oid, ref: "User", required: true },
    others: othersField,
  },
  { ...baseOptions, timestamps: { createdAt: true, updatedAt: true } }
);

LedgerEntrySchema.index({ "account.model": 1, "account.ref": 1, date: 1 });
LedgerEntrySchema.index({ project: 1, date: 1 });
LedgerEntrySchema.index({ "source.kind": 1, "source.ref": 1 });

export default mongoose.model("LedgerEntry", LedgerEntrySchema);