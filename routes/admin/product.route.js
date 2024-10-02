const express = require("express");
const router = express.Router(); // ham Router() de dinh nghia ra cac route con

const controllerProductAdmin = require("../../controllers/admin/product.controller.js");

router.get("/", controllerProductAdmin.index);

router.get("/change-status/:statusChange/:idProduct", controllerProductAdmin.changeStatus);

module.exports = router;