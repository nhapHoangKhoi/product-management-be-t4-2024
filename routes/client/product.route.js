const express = require("express");
const router = express.Router(); // ham Router() de dinh nghia ra cac route con

const controllerProduct = require("../../controllers/client/product.controller.js");

// giong nhu noi chuoi
router.get("/", controllerProduct.index);

router.get("/:slug", controllerProduct.getDetailPage);

module.exports = router;