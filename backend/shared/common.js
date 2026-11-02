import mongoose from "mongoose";
const { Schema } = mongoose;
const oid = Schema.Types.ObjectId;

export const baseOptions = {
  timestamps: true,
  toJSON: { flattenMaps: true },
  toObject: { flattenMaps: true },
};

export const othersField = { type: Map, of: Schema.Types.Mixed, default: undefined };

export const paise = (extra = {}) => ({
  type: Number,
  min: 0,
  validate: { validator: Number.isInteger, message: "{PATH} must be an integer (paise)" },
  ...extra,
});

export const AttachmentSchema = new Schema(
  {
    key: { type: String, required: true },
    url: String,
    originalName: { type: String, required: true },
    mimeType: String,
    size: Number,
    uploadedBy: { type: oid, ref: "User" },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);