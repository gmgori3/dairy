import { validationResult } from "express-validator";
import MilkSeller from "../models/MilkSeller.js";
import MilkBuyer from "../models/MilkBuyer.js";
import User from "../models/User.js";
import responseHandler from "../helper/responseHandler.js";

// -------------------- Get Milk Entry By Date --------------------
export const getMilkEntryByDate = async (req, res) => {
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

    const { dairyId, shift, type, from_date, to_date } = req.body;

    const Model = type == 1 ? MilkSeller : MilkBuyer;

    const milkEntry = await Model.find({
      entryDate: { $gte: new Date(from_date), $lte: new Date(to_date) },
      shift,
      dairyId,
    }).sort({ _id: -1 });

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

// -------------------- Get Milk Entry Daily --------------------
export const getMilkEntryDaily = async (req, res) => {
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

    const Model = type == 1 ? MilkSeller : MilkBuyer;

    const milkEntry = await Model.find({
      entryDate: today,
      shift,
      dairyId,
    }).sort({ _id: -1 });

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

// -------------------- Add Milk Entry --------------------
export const addMilkEntry = async (req, res) => {
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

    // Increment totalMilkEntry in User
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

// -------------------- Edit Milk Entry --------------------
export const editMilkEntry = async (req, res) => {
  try {
    const { id, type } = req.body;
    const Model = type == 1 ? MilkSeller : MilkBuyer;

    const milkEntry = await Model.findById(id);
    if (!milkEntry) {
      return responseHandler.errorResponse(res, "Milk entry not found", [], 403);
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

// -------------------- Update Milk Entry --------------------
export const updateMilkEntry = async (req, res) => {
  try {
    const {
      id,
      type,
      snf,
      clr,
      fat,
      pricePerKg,
      totalPrice,
      milkWeight,
    } = req.body;

    const Model = type == 1 ? MilkSeller : MilkBuyer;

    const existingEntry = await Model.findById(id);
    if (!existingEntry) {
      return responseHandler.errorResponse(res, "Entry not found", [], 404);
    }

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

// -------------------- Delete Milk Entry --------------------
export const deleteMilkEntry = async (req, res) => {
  try {
    const { id, type } = req.body;
    const Model = type == 1 ? MilkSeller : MilkBuyer;

    const milkEntry = await Model.findById(id);
    if (!milkEntry) {
      return responseHandler.errorResponse(res, "Milk entry not found", [], 403);
    }

    await User.findByIdAndUpdate(milkEntry.dairyId, { $inc: { totalMilkEntry: -1 } });
    await milkEntry.deleteOne();

    return responseHandler.successResponse(res, "Milk entry deleted successfully.", []);
  } catch (error) {
    console.error(error);
    return responseHandler.errorResponse(res, "Unauthorized", [], 500);
  }
};
