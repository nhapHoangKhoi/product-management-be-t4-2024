const RoleModel = require("../../models/role.model.js");
const AccountModel = require("../../models/account.model.js");

const md5 = require('md5');
const generateHelper = require("../../helpers/generate.helper.js");
const systemConfigs = require("../../config/system.js");

// ----------------[]------------------- //
// [GET] /admin/accounts/
module.exports.index = (request, response) => {
   response.render(
      "admin/pages/accounts/index.pug", 
      {
         pageTitle: "Tài khoản admin"
      }
   );
}
// ----------------End []------------------- //


// ----------------[]------------------- //
// [GET] /admin/accounts/create
module.exports.getCreatePage = async (request, response) => 
{
   const roleFind = {
      deleted: false
   };

   const listOfRoles = await RoleModel
      .find(roleFind)
      .select(["title"]); // tra ra id (luon luon), truong title

   response.render(
      "admin/pages/accounts/create.pug", 
      {
         pageTitle: "Tạo tài khoản admin",
         listOfRoles: listOfRoles
      }
   );
}

// [POST] /admin/accounts/create
module.exports.createAccountAdmin = async (request, response) =>
{
   // ----- Encrypt password ----- //
   request.body.password = md5(request.body.password);
   // ----- End encrypt password ----- //

   // ----- Generate random token ----- //
   request.body.token = generateHelper.generateToken(30); 
   // ----- End generate random token ----- // 

   
   const newAccountModel = new AccountModel(request.body);
   await newAccountModel.save();

   request.flash("success", "Tạo tài khoản mới thành công!");
   response.redirect(`/${systemConfigs.prefixAdmin}/accounts`);
   // response.send("OK Frontend");
}
// ----------------End []------------------- //