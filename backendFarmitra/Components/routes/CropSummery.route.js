const express = require("express");
const CropSummary = require("../controllers/AddCropSummary.controller")
const router = express.Router();

router.get("/get-crop-summary" , CropSummary.getSummary)
router.patch("/crop/preview/:id" , CropSummary.setCropPreviewTrue)


module.exports = router;
