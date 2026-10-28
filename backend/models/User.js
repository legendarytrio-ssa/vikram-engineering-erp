const mongoose = require("mongoose");
const { Schema } = mongoose;
const { baseOptions, othersField } = require("../shared/common");
const { DEPARTMENTS, SUB_DEPARTMENTS_BY_DEPT, ALL_SUB_DEPARTMENTS, ROLES } = require("../shared/constants");

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true }, // login id
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ROLES, default: "EMPLOYEE", index: true },
    dept: { type: String, enum: DEPARTMENTS },          // CEO may leave empty
    subDept: { type: String, enum: ALL_SUB_DEPARTMENTS },
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date,
    tokenVersion: { type: Number, default: 0 },         // bump to invalidate all issued JWTs
    others: othersField,
  },
  baseOptions
);

UserSchema.index({ dept: 1, subDept: 1, isActive: 1 });

UserSchema.pre("validate", function () {
  if (this.role === "EMPLOYEE" && !this.dept) throw new Error("dept is required for employees");
  if (this.subDept && !(SUB_DEPARTMENTS_BY_DEPT[this.dept] || []).includes(this.subDept)) {
    throw new Error(`subDept ${this.subDept} does not belong to ${this.dept}`);
  }
});

module.exports = mongoose.model("User", UserSchema);
