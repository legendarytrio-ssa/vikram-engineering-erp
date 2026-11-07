import Staff  from "../models/Staff.js";
import { wrapAsync } from "../../../shared/wrapAsync.js";

export const createStaff = wrapAsync(async (req, res) => {
  const staff = new Staff(req.body);
  await staff.save();
  res.status(201).json(staff);
});

export const getStaff = wrapAsync(async (req, res) => {
  const { payType, query } = req.query;
  const filter = { isActive: true };
  
  if (payType) filter.payType = payType;
  
  // Apply Search Filter if typed
  if (query) {
    filter.$or = [
      { empName: { $regex: query, $options: "i" } }, // 'i' makes it case-insensitive
      { empCode: { $regex: query, $options: "i" } }
    ];
  }

  const staff = await Staff.find(filter).sort({ empName: 1 });
  res.status(200).json(staff);
});

export const searchInactiveStaff = wrapAsync(async (req, res) => {
  const { payType, query } = req.query;
  const filter = { isActive: false };
  
  if (payType) filter.payType = payType;

  // Apply Search Filter if typed
  if (query) {
    filter.$or = [
      { empName: { $regex: query, $options: "i" } },
      { empCode: { $regex: query, $options: "i" } }
    ];
  }

  const staff = await Staff.find(filter).sort({ empName: 1 });
  res.status(200).json(staff);
});


export const toggleStaffStatus = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body; // true (reactivate) or false (deactivate)
  
  const staff = await Staff.findById(id);
  if (!staff) return res.status(404).json({ error: "Staff not found" });

  staff.isActive = isActive;
  staff.leavingDate = isActive ? null : new Date(); // clear if reactivating, set if deactivating
  
  await staff.save();
  res.status(200).json(staff);
});

export const editStaff = wrapAsync(async (req, res) => {
  const { empCode, empName, designation, baseAmount, joiningDate } = req.body;
  const staff = await Staff.findByIdAndUpdate(
    req.params.id,
    { empCode, empName, designation, baseAmount, joiningDate },
    { new: true, runValidators: true }
  );
  if (!staff) return res.status(404).json({ error: "Staff not found" });
  res.status(200).json(staff);
});