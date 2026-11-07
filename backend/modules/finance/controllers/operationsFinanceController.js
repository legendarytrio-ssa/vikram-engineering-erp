// import mongoose from "mongoose";
// import ItemPurchase from "../../operations/models/ItemPurchase.js";
// import LedgerEntry from "../models/LedgerEntry.js";
// import { wrapAsync } from "../../../shared/wrapAsync.js";

// const getDayBoundsUTC = (dateStr) => {
//   const d = dateStr ? new Date(`${dateStr}T00:00:00.000Z`) : new Date();
//   return {
//     start: new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0)),
//     end: new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999))
//   };
// };

// export const getOperationsPayables = wrapAsync(async (req, res) => {
//   const { date } = req.query;
//   const { start, end } = getDayBoundsUTC(date);

//   const filter = { 
//     sentToFinance: true,
//     $or: [
//       { sentToFinanceAt: { $gte: start, $lte: end } },
//       { paidOn: { $gte: start, $lte: end } },
//       { financeStatus: "DUE" }
//     ]
//   };

//   const records = await ItemPurchase.find(filter)
//     .populate("project", "projectCode projectName")
//     .sort({ sentToFinanceAt: -1 });

//   records.sort((a, b) => {
//     if (a.financeStatus === "DUE" && b.financeStatus !== "DUE") return -1;
//     if (a.financeStatus !== "DUE" && b.financeStatus === "DUE") return 1;
//     return (a.vendorName || "").localeCompare(b.vendorName || "");
//   });

//   res.status(200).json(records);
// });

// export const toggleOperationsPayableStatus = wrapAsync(async (req, res) => {
//   const { id } = req.params;
//   const { financeStatus, paymentMode, referenceNo, userId } = req.body;

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const po = await ItemPurchase.findById(id).session(session);
//     if (!po || !po.sentToFinance) throw new Error("Payable not found.");

//     po.financeStatus = financeStatus;

//     if (financeStatus === "PAID") {
//       po.paidOn = new Date();
//       po.paymentMode = paymentMode;
//       po.referenceNo = referenceNo;
//       po.markedPaidBy = userId;

//       const entry = new LedgerEntry({
//         particulars: `Payment for PO: ${po.materialName}`,
//         project: po.project,
//         amount: po.totalCost,
//         type: "DEBIT",
//         account: { model: "VendorContractor", ref: po.vendorRef },
//         source: { kind: "ITEM_PURCHASE", ref: po._id },
//         paymentMode,
//         referenceNo,
//         createdBy: userId,
//       });
//       await entry.save({ session });
//     } else {
//       await LedgerEntry.findOneAndDelete({
//         "source.kind": "ITEM_PURCHASE",
//         "source.ref": po._id
//       }).session(session);
      
//       po.paidOn = undefined;
//       po.paymentMode = undefined;
//       po.referenceNo = undefined;
//       po.markedPaidBy = undefined;
//     }

//     await po.save({ session });
//     await session.commitTransaction();
    
//     const populated = await po.populate("project", "projectCode projectName");
//     res.status(200).json(populated);
//   } catch (error) {
//     await session.abortTransaction();
//     throw error;
//   } finally {
//     session.endSession();
//   }
// });