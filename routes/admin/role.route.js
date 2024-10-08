const express = require("express");
const router = express.Router(); // ham Router() de dinh nghia ra cac route con

const controllerAdmin = require("../../controllers/admin/role.controller.js");

router.get("/", controllerAdmin.index);

router.get("/create", controllerAdmin.getCreatePage);
router.post("/create", controllerAdmin.createRole);

router.get("/edit/:idRole", controllerAdmin.getEditPage);
router.patch("/edit/:idRole", controllerAdmin.editRole);

module.exports = router;