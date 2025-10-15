// controllers/snfFatController.js
import SnfFatData from "../models/SnfFatData.js";
import responseHandler from "../helper/responseHandler.js";

// ✅ Get Data by Dairy ID
export const getByDairyId = async (req, res) => {
  const { dairy_id } = req.body;
  try {
    const data = await SnfFatData.find({ dairy_id });
    if (data.length > 0) {
      return responseHandler.successResponse(res, "SNF Fat Data Found Successfully.", data);
    } else {
      return responseHandler.errorResponse(res, "Data Not Found.", [], 404);
    }
  } catch (error) {
    console.error(error);
    return responseHandler.errorResponse(res, "Unauthorized", [], 500);
  }
};

// ✅ Store Multiple Records
export const store = async (req, res) => {
  const { data } = req.body;

  const insertData = data.map(item => ({
    snf: item.snf,
    fat: item.fat,
    value: item.value || 0,
    categorychart_id: item.categorychart_id || 0,
    dairy_id: item.dairy_id
  }));

  try {
    const inserted = await SnfFatData.insertMany(insertData, { ordered: false });
    return responseHandler.successResponse(res, "SNF Fat Data Inserted Successfully.", inserted);
  } catch (error) {
    console.error(error);
    return responseHandler.errorResponse(res, "Unauthorized", [], 500);
  }
};

// ✅ Update Multiple Records
export const update = async (req, res) => {
  const { data } = req.body;
  let updatedRecords = [];

  try {
    for (let item of data) {
      if (!item.id) continue;
      const updated = await SnfFatData.findByIdAndUpdate(
        item.id,
        {
          snf: item.snf,
          fat: item.fat,
          value: item.value || 0,
          categorychart_id: item.categorychart_id || 0,
          dairy_id: item.dairy_id,
        },
        { new: true }
      );
      if (updated) updatedRecords.push(updated);
    }

    return responseHandler.successResponse(res, "SNF Fat Data Updated Successfully.", updatedRecords);
  } catch (error) {
    console.error(error);
    return responseHandler.errorResponse(res, "Unauthorized", [], 500);
  }
};
