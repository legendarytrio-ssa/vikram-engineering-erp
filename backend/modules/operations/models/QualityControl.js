const mongoose = require("mongoose");
const { Schema } = mongoose;
const { baseOptions, othersField, AttachmentSchema } = require("../shared/common");

const QualityControlSchema = new Schema(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    description: { type: String, required: true, trim: true },
    docs: [AttachmentSchema],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    others: othersField,
  },
  baseOptions
);

QualityControlSchema.index({ project: 1, createdAt: -1 });

module.exports = mongoose.model("QualityControl", QualityControlSchema);
