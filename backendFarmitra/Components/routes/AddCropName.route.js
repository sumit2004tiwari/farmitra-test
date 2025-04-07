const express = require("express");
const AddCropName = require("../controllers/AddCropName.controllers")
// const multer = require("../middelware/multer.middelware")
const router = express.Router();
const {uploadCropImageCover} = require("../utils/multer.utils")
const path = require("path");

router.post("/add-crop-name", uploadCropImageCover , AddCropName.addCropName);
router.get("/get-crop-name" , AddCropName.getCropName)
router.delete("/delete-crop-name/:id", AddCropName.deleteCropName);
router.patch("/update-crop-name/:id", uploadCropImageCover , AddCropName.editCropName);

module.exports = router;
