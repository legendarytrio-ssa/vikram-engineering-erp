const mongoose = require("mongoose");
const { Schema } = mongoose;
const oid = Schema.Types.ObjectId;
const { baseOptions, othersField, AttachmentSchema } = require("../shared/common");

const ProjectSchema = new Schema(
  {
    projectCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
    projectName: { type: String, required: true, trim: true },
    tender: { type: oid, ref: "Tender", required: true, unique: true }, // one tender -> one project
    client: { type: oid, ref: "Client", required: true, index: true },
    poDescription: String,
    poDocs: [AttachmentSchema],
    status: {
      type: String,
      enum: ["ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"],
      default: "ACTIVE",
      index: true,
    },
    createdBy: { type: oid, ref: "User", required: true },
    others: othersField,
  },
  { ...baseOptions, toJSON: { flattenMaps: true, virtuals: true }, toObject: { flattenMaps: true, virtuals: true } }
);

// QualityControl and ItemPurchase hold the `project` reference (child -> parent).
// The project never stores arrays of their ids; populate them when needed:
//   Project.findById(id).populate("qualityRecords").populate("purchaseItems")
ProjectSchema.virtual("qualityRecords", { ref: "QualityControl", localField: "_id", foreignField: "project" });
ProjectSchema.virtual("purchaseItems", { ref: "ItemPurchase", localField: "_id", foreignField: "project" });

module.exports = mongoose.model("Project", ProjectSchema);
