const RoleModel = require("../../models/role.model.js");
const systemConfigs = require("../../config/system.js");

// ----------------[]------------------- //
// [GET] /admin/roles/
module.exports.index = async (request, response) => 
{
   const roleFind = {
      deleted: false
   };

   const listOfRoles = await RoleModel.find(roleFind);

   response.render(
      "admin/pages/roles/index.pug", 
      {
         pageTitle: "Nhóm quyền",
         listOfRoles: listOfRoles
      }
   );
}
// ----------------End []------------------- //


// ----------------[]------------------- //
// [GET] /admin/roles/create
module.exports.getCreatePage = (request, response) => 
{
   response.render(
      "admin/pages/roles/create.pug", 
      {
         pageTitle: "Tạo mới nhóm quyền",
      }
   );
}

// [POST] /admin/roles/create
module.exports.createRole = async (request, response) =>
{
   const newRoleModel = new RoleModel(request.body);
   await newRoleModel.save();

   // response.send("OK Frontend");
   request.flash("success", "Thêm mới nhóm quyền thành công!");
   response.redirect(`/${systemConfigs.prefixAdmin}/roles`);
}
// ----------------End []------------------- //


// ----------------[]------------------- //
// [GET] /admin/roles/edit/:idRole
module.exports.getEditPage = async (request, response) => 
{
   try {
      const roleId = request.params.idRole;

      const roleFind = {
         _id: roleId,
         deleted: false
      };

      const theRoleData = await RoleModel.findOne(roleFind);
      
      if(theRoleData) // check != null, vi co render ra giao dien nen them if else cho nay nua
      {
         response.render(
            "admin/pages/roles/edit.pug", 
            {
               pageTitle: "Chỉnh sửa nhóm quyền",
               theRoleData: theRoleData
            }
         );
      }
      else {
         response.redirect(`/${systemConfigs.prefixAdmin}/roles`);
      }
   }
   catch(error) {
      // catch la do nguoi ta hack, pha
      // console.log(error);
      request.flash("error", "ID sản phẩm không hợp lệ!");
      response.redirect(`/${systemConfigs.prefixAdmin}/roles`);
   }
}

// [PATCH] /admin/roles/edit/:idRole
module.exports.editRole = async (request, response) => 
{
   try {
      const roleId = request.params.idRole;

      await RoleModel.updateOne(
         {
            _id: roleId
         },
         request.body
      );

      request.flash("success", "Cập nhật thành công!");
      // response.send("OK Frontend");
      response.redirect("back"); // tuc la quay ve lai trang [GET] /admin/roles/edit
   }
   catch(error) {
      // catch la do nguoi ta hack, pha
      console.log(error);
      request.flash("error", "ID nhóm quyền không hợp lệ!");
      response.redirect(`/${systemConfigs.prefixAdmin}/roles`);
   }
}
// ----------------End []------------------- //


// ----------------[]------------------- //
// [GET] /admin/roles/permissons
module.exports.getPermissionPage = async (request, response) => 
{
   const roleFind = {
      deleted: false
   };

   const records = await RoleModel.find(roleFind);

   response.render(
      "admin/pages/roles/permissions.pug", 
      {
         pageTitle: "Phân quyền",
         records: records
      }
   );
}

// [PATCH] /admin/roles/permissons
module.exports.editPermissions = async (request, response) => 
{
   const listRoles = request.body;

   for(const eachRole of listRoles) {
      await RoleModel.updateOne(
         {
            _id: eachRole.id,
            deleted: false
         },
         {
            permissions: eachRole.permissions
         }
      );
   }

   // request.flash("success", "Cập nhật thành công!"); // cach nay truoc gio, thu dung cach khac

   response.json(
      {
         code: 200,
         message: "Cập nhật thành công!"
      }
   );
}
// ----------------End []------------------- //