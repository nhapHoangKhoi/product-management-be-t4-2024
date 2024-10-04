const express = require("express");
const router = express.Router(); // ham Router() de dinh nghia ra cac route con

const controllerProductAdmin = require("../../controllers/admin/product.controller.js");

router.get("/", controllerProductAdmin.index);

router.patch("/change-status/:statusChange/:idProduct", controllerProductAdmin.changeStatus);

router.patch("/change-multi", controllerProductAdmin.changeMulti);

router.patch("/delete/:idProduct", controllerProductAdmin.softDeleteProduct);

router.get("/trash", controllerProductAdmin.getDeletedProducts); // danh sach san pham da bi xoa
router.delete("/delete-permanent/:idProduct", controllerProductAdmin.permanentDeleteProduct);
router.patch("/recover/:idProduct", controllerProductAdmin.recoverProduct);
router.delete("/delete-many-permanent", controllerProductAdmin.permanentDeleteManyProducts);

module.exports = router;