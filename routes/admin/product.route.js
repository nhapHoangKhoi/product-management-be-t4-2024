const express = require("express");
const router = express.Router(); // ham Router() de dinh nghia ra cac route con

const controllerProductAdmin = require("../../controllers/admin/product.controller.js");

router.get("/", controllerProductAdmin.index);

router.get("/trash", controllerProductAdmin.getDeletedProducts); // danh sach san pham da bi xoa

router.get("/create", controllerProductAdmin.getCreatePage);

router.post("/create", controllerProductAdmin.createProduct);

router.patch("/change-status/:statusChange/:idProduct", controllerProductAdmin.changeStatus);

router.patch("/change-multi", controllerProductAdmin.changeMulti);

router.patch("/delete/:idProduct", controllerProductAdmin.softDeleteProduct);

router.patch("/recover/:idProduct", controllerProductAdmin.recoverProduct);

router.patch("/change-position/:idProduct", controllerProductAdmin.changeProductPosition);

router.delete("/delete-permanent/:idProduct", controllerProductAdmin.permanentDeleteProduct);

router.delete("/delete-many-permanent", controllerProductAdmin.permanentDeleteManyProducts);

module.exports = router;