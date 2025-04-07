const express = require("express");
const CropCategory = require("../controllers/CropCategory.controllers");
const router = express.Router();
const {upload} = require("../utils/multer.utils")
const path = require("path");

router.post("/add-crop-category", upload.single("image") , CropCategory.addCropCategory);
router.get("/categories/get-categorise" , CropCategory.getCropCategory)
router.delete("/delete-categorise/:id" , CropCategory.deleteCropCategory)
router.put("/edit-categorise/:id", upload.single("image"),  CropCategory.editCropCategory);
  

module.exports = router;
