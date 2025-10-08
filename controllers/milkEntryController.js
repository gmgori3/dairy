const { validationResult } = require("express-validator");
const MilkSeller = require("../models/MilkSeller");
const MilkBuyer = require("../models/MilkBuyer");
const User = require("../models/User");
const responseHandler = require("../helper/responseHandler");

// Get milk entry by date
exports.getMilkEntryByDate = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { return responseHandler.errorResponse(
        res,
        errors.array()[0].msg,
        [],
        403
      );
    }

    const { dairyId, shift, type, from_date, to_date } = req.body;

    let milkEntry;
    if (type == 1) {
      milkEntry = await MilkSeller.find({
        entryDate: { $gte: new Date(from_date), $lte: new Date(to_date) },
        shift,
        dairyId,
      }).sort({ _id: -1 });
    } else {
      milkEntry = await MilkBuyer.find({
        entryDate: { $gte: new Date(from_date), $lte: new Date(to_date) },
        shift,
        dairyId,
      }).sort({ _id: -1 });
    }

    return responseHandler.successResponse(
      res,
      "Milk entry found successfully.",
      milkEntry
    );
  } catch (error) {
    console.error(error);
    return responseHandler.errorResponse(res, "Unauthorized", [], 500);
  }
};

// Get milk entry daily
exports.getMilkEntryDaily = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return responseHandler.errorResponse(
        res,
        errors.array()[0].msg,
        [],
        403
      );
    }

    const { dairyId, shift, type } = req.body;
    const today = new Date().toISOString().split("T")[0];

    let milkEntry =
      type == 1
        ? await MilkSeller.find({ entryDate: today, shift, dairyId }).sort({ _id: -1 })
        : await MilkBuyer.find({ entryDate: today, shift, dairyId }).sort({ _id: -1 });

    return responseHandler.successResponse(
      res,
      "Milk entry found successfully.",
      milkEntry
    );
  } catch (error) {
    console.error(error);
    return responseHandler.errorResponse(res, "Unauthorized", [], 500);
  }
};

// Add milk entry
exports.addMilkEntry = async (req, res) => {
  try {
    const {
      type,
      dairyId,
      customerId,
      snf,
      clr,
      fat,
      pricePerKg,
      entryDate,
      milkType,
      shift,
      totalPrice,
      milkWeight,
    } = req.body;

    const Model = type == 1 ? MilkSeller : MilkBuyer;

    // ✅ Create new entry
    const milkEntry = await Model.create({
      dairyId,
      customerId,
      snf,
      clr,
      fat,
      pricePerKg,
      entryDate,
      milkType,
      shift,
      totalPrice,
      milkWeight,
    });

    // ✅ Increment total entry count
    await User.findByIdAndUpdate(dairyId, { $inc: { totalMilkEntry: 1 } });

    return responseHandler.successResponse(
      res,
      "Milk entry added successfully.",
      milkEntry
    );
  } catch (error) {
    console.error("Add Milk Entry Error:", error);
    return responseHandler.errorResponse(res, "Failed to add entry", [], 500);
  }
};




// Edit milk entry (retrieve details for editing)
exports.editMilkEntry = async (req, res) => {
  try {
    const { id, type } = req.body;
    const milkEntry =
      type == 1 ? await MilkSeller.findById(id) : await MilkBuyer.findById(id);

    if (!milkEntry) {
      return responseHandler.errorResponse(
        res,
        "Milk entry not found",
        [],
        403
      );
    }

    return responseHandler.successResponse(
      res,
      "Milk entry fetched successfully.",
      milkEntry
    );
  } catch (error) {
    console.error(error);
    return responseHandler.errorResponse(res, "Unauthorized", [], 500);
  }
};

// Update milk entry
exports.updateMilkEntry = async (req, res) => {
  try {
    const {
      id, // ✅ milk entry _id
      type,
      snf,
      clr,
      fat,
      pricePerKg,
      totalPrice,
      milkWeight,
    } = req.body;

    const Model = type == 1 ? MilkSeller : MilkBuyer;

    // ✅ Find by ID
    const existingEntry = await Model.findById(id);

    if (!existingEntry) {
      return responseHandler.errorResponse(res, "Entry not found", [], 404);
    }

    // ✅ Update fields
    existingEntry.snf = snf ?? existingEntry.snf;
    existingEntry.clr = clr ?? existingEntry.clr;
    existingEntry.fat = fat ?? existingEntry.fat;
    existingEntry.pricePerKg = pricePerKg ?? existingEntry.pricePerKg;
    existingEntry.totalPrice = totalPrice ?? existingEntry.totalPrice;
    existingEntry.milkWeight = milkWeight ?? existingEntry.milkWeight;

    const updatedEntry = await existingEntry.save();

    return responseHandler.successResponse(
      res,
      "Milk entry updated successfully.",
      updatedEntry
    );
  } catch (error) {
    console.error("Update Milk Entry Error:", error);
    return responseHandler.errorResponse(res, "Failed to update entry", [], 500);
  }
};


// Delete milk entry
exports.deleteMilkEntry = async (req, res) => {
  try {
    const { id, type } = req.body;
    const milkEntry =
      type == 1 ? await MilkSeller.findById(id) : await MilkBuyer.findById(id);

    if (!milkEntry) {
      return responseHandler.errorResponse(
        res,
        "Milk entry not found",
        [],
        403
      );
    }

    await User.findByIdAndUpdate(milkEntry.dairyId, { $inc: { totalMilkEntry: -1 } });
    await milkEntry.deleteOne();

    return responseHandler.successResponse(res, "Milk entry deleted successfully.", []);
  } catch (error) {
    console.error(error);
    return responseHandler.errorResponse(res, "Unauthorized", [], 500);
  }
};
