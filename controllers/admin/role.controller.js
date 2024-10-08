const RoleModel = require("../../models/role.model.js");

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