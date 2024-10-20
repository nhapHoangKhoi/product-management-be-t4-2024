const express = require("express");
const router = express.Router(); // ham Router() de dinh nghia ra cac route con

const controller = require("../../controllers/client/user.controller.js");

router.get("/register", controller.getRegisterPage);
router.post("/register", controller.registerUserAccount);

router.get("/login", controller.getLoginPage);
router.post("/login", controller.loginUserAccount);

router.get("/logout", controller.logout);

module.exports = router;