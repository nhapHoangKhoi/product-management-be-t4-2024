const express = require("express");
const multer  = require('multer');
const router = express.Router(); // ham Router() de dinh nghia ra cac route con

const controllerAdmin = require("../../controllers/admin/account.controller.js");
const functionsUploadFileToCloud = require("../../middlewares/admin/uploadCloud.middleware.js");
const validate = require("../../validates/admin/account.validate.js");

// ------ Upload 1 file
const upload = multer();
// ----- End upload 1 file

router.get("/", controllerAdmin.index);

router.get("/create", controllerAdmin.getCreatePage);
router.post(
   "/create", 
   upload.single("avatar"), // de up anh tu frontend len ung dung backend nodejs
   functionsUploadFileToCloud.uploadSingleFile, // de up anh tu backend nodejs len cloudinary
   validate.createAccountAdmin,
   controllerAdmin.createAccountAdmin
);

router.get("/edit/:idAccount", controllerAdmin.getEditPage);
router.patch(
   "/edit/:idAccount", 
   upload.single("avatar"), // de up anh tu frontend len ung dung backend nodejs
   functionsUploadFileToCloud.uploadSingleFile, // de up anh tu backend nodejs len cloudinary
   validate.editAccountAdmin,
   controllerAdmin.editAccountAdmin
);

module.exports = router;