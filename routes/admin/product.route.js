const express = require("express");
const multer  = require('multer');
const router = express.Router(); // ham Router() de dinh nghia ra cac route con

const controllerProductAdmin = require("../../controllers/admin/product.controller.js");
const validate = require("../../validates/admin/product.validate.js");
const functionsUploadFileToCloud = require("../../middlewares/admin/uploadCloud.middleware.js");


// ------ Upload 1 file
// ko dung 3 doan code nay nua
//
// const storageMulterHelper = require("../../helpers/storageMulter.helper.js");
// const storage = storageMulterHelper.storage;
// const upload = multer({ storage: storage });
//
const upload = multer();
// ----- End upload 1 file

// /products/
router.get("/", controllerProductAdmin.index);

router.get("/trash", controllerProductAdmin.getDeletedProducts); // danh sach san pham da bi xoa

router.get("/create", controllerProductAdmin.getCreatePage);

router.get("/edit/:idProduct", controllerProductAdmin.getEditPage);

router.get("/detail/:idProduct", controllerProductAdmin.getDetailPage);

router.post(
   "/create", 
   upload.single("thumbnail"), // de up anh tu frontend len ung dung backend nodejs
   functionsUploadFileToCloud.uploadSingleFile, // de up anh tu backend nodejs len cloudinary
   validate.createProduct, 
   controllerProductAdmin.createProduct
);

router.patch("/change-status/:statusChange/:idProduct", controllerProductAdmin.changeStatus);

router.patch("/change-multi", controllerProductAdmin.changeMulti);

router.patch("/delete/:idProduct", controllerProductAdmin.softDeleteProduct);

router.patch("/recover/:idProduct", controllerProductAdmin.recoverProduct);

router.patch("/change-position/:idProduct", controllerProductAdmin.changeProductPosition);

router.patch(
   "/edit/:idProduct", 
   upload.single("thumbnail"), // de up anh tu frontend len ung dung backend nodejs
   functionsUploadFileToCloud.uploadSingleFile, // de up anh tu backend nodejs len cloudinary
   validate.createProduct, 
   controllerProductAdmin.editProduct
);

router.delete("/delete-permanent/:idProduct", controllerProductAdmin.permanentDeleteProduct);

router.delete("/delete-many-permanent", controllerProductAdmin.permanentDeleteManyProducts);

module.exports = router;