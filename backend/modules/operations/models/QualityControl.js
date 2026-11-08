
import mongoose from "mongoose";
import {
  baseOptions,
  othersField,
  AttachmentSchema,
} from "../../../shared/common.js";

const { Schema } = mongoose;

const QualityControlSchema = new Schema(
  {
    // Every QC report belongs directly to a project.
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    // Optional vendor associated with the report.
    vendorName: {
      type: String,
      trim: true,
      default: "",
    },

    // Report title.
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Report description.
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Dynamic quality parameters.
    customFields: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        value: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    // Supporting documents.
    docs: [AttachmentSchema],

    // createdBy: {
    //   type: Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },

    others: othersField,
  },
  baseOptions
);

// Efficiently retrieve reports belonging to a project,
// ordered by creation date.
QualityControlSchema.index({
  project: 1,
  createdAt: -1,
});

const QualityControl = mongoose.model(
  "QualityControl",
  QualityControlSchema
);

export default QualityControl;
