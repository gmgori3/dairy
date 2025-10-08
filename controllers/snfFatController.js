// controllers/snfFatController.js
const SnfFatData = require("../models/SnfFatData");
const responseHandler = require("../helper/responseHandler");


// ✅ Get Data by Dairy ID
exports.getByDairyId = async (req, res) => {
  const { dairy_id } = req.body;
  try {
    const data = await SnfFatData.find({ dairy_id: dairy_id });
    if (data.length > 0) {
      return responseHandler.successResponse(res, "SNF Fat Data Found Successfully.", data);
    } else {
      return responseHandler.errorResponse(res, "Data Not Found.", [], 404);
    }
  } catch (error) {
    return responseHandler.errorResponse(res, "Unauthorized", [], 500);
  }
};

// ✅ Store Multiple Records
exports.store = async (req, res) => {
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
    console.log(inserted);

    return responseHandler.successResponse(res, "SNF Fat Data Inserted Successfully.", inserted);
  } catch (error) {
    return responseHandler.errorResponse(res, "Unauthorized", [], 500);
  }
};

// ✅ Update Multiple Records
exports.update = async (req, res) => {
  const { data } = req.body;
  let updatedRecords = [];

  try {
    for (let item of data) {
      if (!item.id) continue;
      let updated = await SnfFatData.findByIdAndUpdate(
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
    return responseHandler.errorResponse(res, "Unauthorized", [], 500);
  }
};
