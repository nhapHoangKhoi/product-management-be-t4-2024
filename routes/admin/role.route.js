const express = require("express");
const router = express.Router(); // ham Router() de dinh nghia ra cac route con

const controllerAdmin = require("../../controllers/admin/role.controller.js");

router.get("/", controllerAdmin.index);
router.patch("/change-multi", controllerAdmin.changeMulti);
router.patch("/delete/:idRole", controllerAdmin.softDeleteRole);

router.get("/create", controllerAdmin.getCreatePage);
router.post("/create", controllerAdmin.createRole);

router.get("/edit/:idRole", controllerAdmin.getEditPage);
router.patch("/edit/:idRole", controllerAdmin.editRole);

router.get("/permissions", controllerAdmin.getPermissionPage);
router.patch("/permissions", controllerAdmin.editPermissions);

router.get("/trash", controllerAdmin.getDeletedRoles);
router.patch("/recover/:idRole", controllerAdmin.recoverRole);
router.delete("/delete-permanent/:idRole", controllerAdmin.permanentDeleteRole);
router.delete("/delete-many-permanent", controllerAdmin.permanentDeleteManyRoles);

module.exports = router;