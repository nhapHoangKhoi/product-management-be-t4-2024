const express = require("express");
const multer  = require('multer');
const router = express.Router(); // ham Router() de dinh nghia ra cac route con

const controllerProductAdmin = require("../../controllers/admin/product.controller.js");
const validate = require("../../validates/admin/product.validate.js");

// ------ Upload 1 file
const storageMulterHelper = require("../../helpers/storageMulter.helper.js");
const storage = storageMulterHelper.storage;

const upload = multer({ storage: storage });
// ----- End upload 1 file


router.get("/", controllerProductAdmin.index);

router.get("/trash", controllerProductAdmin.getDeletedProducts); // danh sach san pham da bi xoa

router.get("/create", controllerProductAdmin.getCreatePage);

router.post(
   "/create", 
   upload.single("thumbnail"),
   validate.createProduct, 
   controllerProductAdmin.createProduct
);

router.patch("/change-status/:statusChange/:idProduct", controllerProductAdmin.changeStatus);

router.patch("/change-multi", controllerProductAdmin.changeMulti);

router.patch("/delete/:idProduct", controllerProductAdmin.softDeleteProduct);

router.patch("/recover/:idProduct", controllerProductAdmin.recoverProduct);

router.patch("/change-position/:idProduct", controllerProductAdmin.changeProductPosition);

router.delete("/delete-permanent/:idProduct", controllerProductAdmin.permanentDeleteProduct);

router.delete("/delete-many-permanent", controllerProductAdmin.permanentDeleteManyProducts);

module.exports = router;