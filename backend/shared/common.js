// // import mongoose from "mongoose"
// const oid = Schema.Types.ObjectId;

// // Options used by every schema
// export const baseOptions = {
//   timestamps: true,
//   toJSON: { flattenMaps: true },   // so `others` (a Map) serialises as a plain object
//   toObject: { flattenMaps: true },
// };

// // "Others": free-form key/value pairs. Keys cannot contain "." or start with "$".
// export const othersField = { type: Map, of: Schema.Types.Mixed, default: undefined };

// // Money is stored as INTEGER PAISE. Never floats.
// export const paise = (extra = {}) => ({
//   type: Number,
//   min: 0,
//   validate: { validator: Number.isInteger, message: "{PATH} must be an integer (paise)" },
//   ...extra,
// });

// // Uploaded file metadata. The file itself lives in object storage.
// export const AttachmentSchema = new Schema(
//   {
//     key: { type: String, required: true },
//     url: String,
//     originalName: { type: String, required: true },
//     mimeType: String,
//     size: Number,
//     uploadedBy: { type: oid, ref: "User" },
//     uploadedAt: { type: Date, default: Date.now },
//   },
//   { _id: true }
// );


import mongoose from "mongoose";

const { Schema } = mongoose;
const oid = Schema.Types.ObjectId;

// Options used by every schema
export const baseOptions = {
  timestamps: true,
  toJSON: { flattenMaps: true },   // so `others` (a Map) serialises as a plain object
  toObject: { flattenMaps: true },
};

// "Others": free-form key/value pairs. Keys cannot contain "." or start with "$".
export const othersField = { type: Map, of: Schema.Types.Mixed, default: undefined };

// Money is stored as INTEGER PAISE. Never floats.
export const paise = (extra = {}) => ({
  type: Number,
  min: 0,
  validate: { validator: Number.isInteger, message: "{PATH} must be an integer (paise)" },
  ...extra,
});

// Uploaded file metadata. The file itself lives in object storage.
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