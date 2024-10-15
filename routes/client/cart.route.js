const express = require("express");
const router = express.Router(); // ham Router() de dinh nghia ra cac route con

const controller = require("../../controllers/client/cart.controller.js");

router.post("/add/:productId", controller.addToCart);

module.exports = router;