const mongoose = require("mongoose");
const { Schema } = mongoose;
const oid = Schema.Types.ObjectId;
const { baseOptions, othersField, paise } = require("../shared/common");
const { PAY_MODES } = require("../shared/constants");

const LedgerEntrySchema = new Schema(
  {
    date: { type: Date, required: true, default: Date.now },
    particulars: { type: String, required: true, trim: true },
    project: { type: oid, ref: "Project" },       // enables the Project Ledger
    amount: paise({ required: true, min: 1 }),
    type: { type: String, enum: ["DEBIT", "CREDIT"], required: true }, // DEBIT = Paid, CREDIT = Due

    // WHOSE ledger this entry belongs to (needed for vendor / client / individual ledgers)
    account: {
      model: { type: String, enum: ["VendorContractor", "Client", "Staff"] },
      ref: { type: oid, refPath: "account.model" },
    },

    // WHAT produced this entry
    source: {
      kind: {
        type: String,
        enum: ["ITEM_PURCHASE", "PAYROLL", "EXPENSE", "CLIENT_RECEIPT", "MANUAL", "REVERSAL"],
        required: true,
      },
      ref: oid,                                   // _id of the ItemPurchase / PayrollRecord / Expense
    },
    paymentMode: { type: String, enum: PAY_MODES },
    referenceNo: String,
    reversalOf: { type: oid, ref: "LedgerEntry" },
    createdBy: { type: oid, ref: "User", required: true },
    others: othersField,
  },
  { ...baseOptions, timestamps: { createdAt: true, updatedAt: false } }
);

LedgerEntrySchema.index({ "account.model": 1, "account.ref": 1, date: 1 }); // individual ledger
LedgerEntrySchema.index({ project: 1, date: 1 });                            // project ledger
LedgerEntrySchema.index({ "source.kind": 1, "source.ref": 1 });

LedgerEntrySchema.pre("validate", function () {
  const needsAccount = ["ITEM_PURCHASE", "PAYROLL", "CLIENT_RECEIPT"].includes(this.source && this.source.kind);
  if (needsAccount && !(this.account && this.account.model && this.account.ref)) {
    throw new Error(`account is required for ${this.source.kind} entries`);
  }
});

/* ---------- append-only: fix mistakes with a REVERSAL entry, never edit ---------- */
const blocked = () => { throw new Error("Ledger entries are immutable. Create a reversal entry instead."); };
["updateOne", "updateMany", "findOneAndUpdate", "findOneAndReplace", "replaceOne",
  "deleteMany", "findOneAndDelete"].forEach((op) => LedgerEntrySchema.pre(op, blocked));
LedgerEntrySchema.pre("deleteOne", { document: true, query: true }, blocked);
LedgerEntrySchema.pre("save", function () {
  if (!this.isNew) throw new Error("Ledger entries are immutable. Create a reversal entry instead.");
});

module.exports = mongoose.model("LedgerEntry", LedgerEntrySchema);
