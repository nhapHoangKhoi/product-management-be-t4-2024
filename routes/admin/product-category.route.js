const express = require("express");
const multer  = require('multer');
const router = express.Router(); // ham Router() de dinh nghia ra cac route con

const controllerAdmin = require("../../controllers/admin/product-category.controller.js");
const validate = require("../../validates/admin/product-category.validate.js");
const functionsUploadFileToCloud = require("../../middlewares/admin/uploadCloud.middleware.js");

// ------ Upload 1 file
const upload = multer();
// ----- End upload 1 file

// /product-categories
router.get("/", controllerAdmin.index);

router.get("/create", controllerAdmin.getCreatePage);

router.post(
   "/create",
   upload.single("thumbnail"), // de up anh tu frontend len ung dung backend nodejs
   functionsUploadFileToCloud.uploadSingleFile, // de up anh tu backend nodejs len cloudinary 
   validate.createCategory,
   controllerAdmin.createCategory
);

module.exports = router;