import PayrollRecord from "../models/PayrollRecord.js";
import Staff from "../models/Staff.js";
import { wrapAsync } from "../../../shared/wrapAsync.js";

export const getOrGeneratePayroll = wrapAsync(async (req, res) => {
  const { date, payType, userId } = req.body;
  
  const period = PayrollRecord.getPeriod(date, payType);
  
  const existingRecords = await PayrollRecord.find({ 
    payType, 
    periodStart: period.periodStart 
  });
  const existingStaffIds = existingRecords.map(r => r.staff.toString());

  const staffType = payType === "MONTHLY" ? "SALARIED" : "WAGED";
  const activeStaff = await Staff.find({ isActive: true, payType: staffType });
  
  const missingStaff = activeStaff.filter(s => !existingStaffIds.includes(s._id.toString()));

  if (missingStaff.length > 0) {
    const newRecords = missingStaff.map(s => ({
      staff: s._id,
      payType,
      periodStart: period.periodStart,
      netAmount: s.baseAmount,
      status: "DUE",
      createdBy: userId 
    }));
    await PayrollRecord.insertMany(newRecords);
  }

  const finalRecords = await PayrollRecord.find({ 
    payType, 
    periodStart: period.periodStart 
  }).populate("staff", "empCode empName designation isActive"); // Note: added isActive here
  
  // Sort array: DUE records first, then by Employee Name alphabetically
  finalRecords.sort((a, b) => {
    if (a.status === "DUE" && b.status !== "DUE") return -1;
    if (a.status !== "DUE" && b.status === "DUE") return 1;
    return a.staff.empName.localeCompare(b.staff.empName);
  });
  
  res.status(200).json({ periodLabel: period.periodLabel, records: finalRecords });
});






export const togglePayrollStatus = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const { status, paymentMode, referenceNo, userId } = req.body;

  const record = await PayrollRecord.findById(id);
  if (!record) {
    res.status(404);
    throw new Error("Record not found");
  }

  record.status = status;
  if (status === "PAID") {
    record.paidOn = new Date();
    record.paymentMode = paymentMode;
    record.referenceNo = referenceNo;
    record.markedPaidBy = userId;
  }
  
  await record.save();
  res.status(200).json(record);
});

export const getPayrollSummary = wrapAsync(async (req, res) => {
  const { date, payType } = req.query; // e.g., ?date=2026-11-03&payType=MONTHLY
  
  // Uses the built-in static aggregation method
  const summary = await PayrollRecord.summarize(date, payType);
  
  // Format the output for the frontend: { DUE: { count, total }, PAID: { count, total } }
  const formatted = summary.reduce((acc, curr) => {
    acc[curr._id] = { count: curr.count, total: curr.total };
    return acc;
  }, { DUE: { count: 0, total: 0 }, PAID: { count: 0, total: 0 } });

  res.status(200).json(formatted);
});

export const bulkPayPayroll = wrapAsync(async (req, res) => {
  const { recordIds, paymentMode, referenceNo, userId } = req.body;

  if (!Array.isArray(recordIds) || recordIds.length === 0) {
    return res.status(400).json({ error: "No records provided" });
  }

  // Update multiple records in a single query
  const result = await PayrollRecord.updateMany(
    { _id: { $in: recordIds }, status: "DUE" },
    { 
      $set: { 
        status: "PAID", 
        paidOn: new Date(), 
        paymentMode, 
        referenceNo, 
        markedPaidBy: userId 
      } 
    }
  );

  res.status(200).json({ 
    message: "Bulk payment successful", 
    modifiedCount: result.modifiedCount 
  });
});