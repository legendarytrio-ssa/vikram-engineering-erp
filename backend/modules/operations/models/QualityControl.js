import mongoose from "mongoose";
import {
  baseOptions,
  othersField,
  AttachmentSchema,
} from "../../../shared/common.js";

const { Schema } = mongoose;

const QualityControlSchema = new Schema(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    docs: [AttachmentSchema],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    others: othersField,
  },
  baseOptions
);

QualityControlSchema.index({ project: 1, createdAt: -1 });

const QualityControl = mongoose.model(
  "QualityControl",
  QualityControlSchema
);

export default QualityControl;