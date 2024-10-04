const express = require("express");
const router = express.Router(); // ham Router() de dinh nghia ra cac route con

const controllerProductAdmin = require("../../controllers/admin/product.controller.js");

router.get("/", controllerProductAdmin.index);

router.patch("/change-status/:statusChange/:idProduct", controllerProductAdmin.changeStatus);

router.patch("/change-multi", controllerProductAdmin.changeMulti);

router.delete("/delete/:idProduct", controllerProductAdmin.deleteProduct);

module.exports = router;