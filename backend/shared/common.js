const { Schema } = require("mongoose");
const oid = Schema.Types.ObjectId;

// Options used by every schema
const baseOptions = {
  timestamps: true,
  toJSON: { flattenMaps: true },   // so `others` (a Map) serialises as a plain object
  toObject: { flattenMaps: true },
};

// "Others": free-form key/value pairs. Keys cannot contain "." or start with "$".
const othersField = { type: Map, of: Schema.Types.Mixed, default: undefined };

// Money is stored as INTEGER PAISE. Never floats.
const paise = (extra = {}) => ({
  type: Number,
  min: 0,
  validate: { validator: Number.isInteger, message: "{PATH} must be an integer (paise)" },
  ...extra,
});

// Uploaded file metadata. The file itself lives in object storage.
const AttachmentSchema = new Schema(
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

module.exports = { baseOptions, othersField, paise, AttachmentSchema };
