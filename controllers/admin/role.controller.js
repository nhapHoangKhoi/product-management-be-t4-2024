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