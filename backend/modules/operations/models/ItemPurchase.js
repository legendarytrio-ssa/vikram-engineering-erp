const mongoose = require("mongoose");
const { Schema } = mongoose;
const oid = Schema.Types.ObjectId;
const { baseOptions, othersField, paise } = require("../shared/common");

const LOCKED_AFTER_SEND = ["project", "rawMaterial", "qty", "unitPrice", "vendor"];

const ItemPurchaseSchema = new Schema(
  {
    project: { type: oid, ref: "Project", required: true },
    rawMaterial: { type: String, required: true, trim: true },
    qty: { type: Number, required: true, min: 0 },
    unitPrice: paise({ required: true }),
    totalPrice: paise(),                          // computed: qty * unitPrice (budget)
    actualBillAmount: paise(),                    // README's Actual_Bill_Amount
    remarks: String,
    vendor: { type: oid, ref: "VendorContractor", required: true },
    vendorName: { type: String },                 // snapshot, auto-filled from vendor
    financeStatus: {
      type: String,
      enum: ["DRAFT", "SENT_TO_FINANCE", "PAID"],
      default: "DRAFT",
      index: true,
    },
    sentToFinanceAt: Date,
    sentToFinanceBy: { type: oid, ref: "User" },
    createdBy: { type: oid, ref: "User", required: true },
    others: othersField,
  },
  baseOptions
);

ItemPurchaseSchema.index({ project: 1, createdAt: 1 });
ItemPurchaseSchema.index({ vendor: 1 });
ItemPurchaseSchema.index({ financeStatus: 1, sentToFinanceAt: -1 }); // Operations Finance queue

// remember the status the document had when loaded
ItemPurchaseSchema.post("init", function () {
  this.$locals.originalFinanceStatus = this.financeStatus;
});

ItemPurchaseSchema.pre("validate", async function () {
  this.totalPrice = Math.round(this.qty * this.unitPrice);

  if (this.vendor && (this.isNew || this.isModified("vendor"))) {
    const v = await mongoose.model("VendorContractor").findById(this.vendor).select("name").lean();
    if (!v) throw new Error("Vendor/Contractor not found");
    this.vendorName = v.name;
  }

  // Purchase can't change the money fields once Finance has them (use doc.save(), not update queries)
  const original = this.$locals.originalFinanceStatus;
  if (original && original !== "DRAFT") {
    const touched = LOCKED_AFTER_SEND.filter((f) => this.isModified(f));
    if (touched.length) throw new Error(`Cannot edit ${touched.join(", ")} after sending to finance`);
  }
});

ItemPurchaseSchema.methods.sendToFinance = function (userId) {
  if (this.financeStatus !== "DRAFT") throw new Error("Already sent to finance");
  this.financeStatus = "SENT_TO_FINANCE";
  this.sentToFinanceAt = new Date();
  this.sentToFinanceBy = userId;
  return this.save();
};

module.exports = mongoose.model("ItemPurchase", ItemPurchaseSchema);
