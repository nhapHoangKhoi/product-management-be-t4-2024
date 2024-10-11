const RoleModel = require("../../models/role.model.js");
const AccountModel = require("../../models/account.model.js");

const md5 = require('md5');
const generateHelper = require("../../helpers/generate.helper.js");
const systemConfigs = require("../../config/system.js");

// ----------------[]------------------- //
// [GET] /admin/accounts/
module.exports.index = async (request, response) => 
{
   const accountFind = {
      deleted: false
   };

   const listOfAccounts = await AccountModel.find(accountFind);

   for(const eachAccount of listOfAccounts) {
      const roleFind = {
         _id: eachAccount.role_id,
         deleted: false
      };
      const correspondRole = await RoleModel.findOne(roleFind);
      eachAccount.roleTitle = correspondRole.title;
   }

   response.render(
      "admin/pages/accounts/index.pug", 
      {
         pageTitle: "Tài khoản admin",
         listOfAccounts: listOfAccounts
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


// ----------------[]------------------- //
// [GET] /admin/accounts/edit/:idAccount
module.exports.getEditPage = async (request, response) => 
{
   try {
      const accountId = request.params.idAccount;
      const roleFind = {
         deleted: false
      };
      const accountFind = {
         _id: accountId,
         deleted: false
      };
   
      const listOfRoles = await RoleModel
         .find(roleFind)
         .select(["title"]); // tra ra id (luon luon), truong title
      
      const theAccountData = await AccountModel.findOne(accountFind);
   
      if(theAccountData) // check != null, vi co render ra giao dien nen them if else cho nay nua
      {
         response.render(
            "admin/pages/accounts/edit.pug",
            {
               pageTitle: "Chỉnh sửa tài khoản admin",
               listOfRoles: listOfRoles,
               theAccountData: theAccountData
            }
         );
      }
      else {
         response.redirect(`/${systemConfigs.prefixAdmin}/accounts`);
      }
   }
   catch(error) {
      // catch la do nguoi ta hack, pha
      // console.log(error);
      request.flash("error", "ID tài khoản không hợp lệ!");
      response.redirect(`/${systemConfigs.prefixAdmin}/roles`);
   }
}

// [PATCH] /admin/accounts/edit/:idAccount
module.exports.editAccountAdmin = async (request, response) =>
{
   try {
      const accountId = request.params.idAccount;
         
      if(request.body.password == "") {
         delete request.body.password; // delete password field before submitting
      }
      else {
         request.body.password = md5(request.body.password);
      }
   
      await AccountModel.updateOne(
         {
            _id: accountId,
            deleted: false
         },
         request.body
      );
   
      request.flash("success", "Cập nhật thành công!");
   }
   catch(error) {
      request.flash("error", "ID tài khoản không hợp lệ!");
   }

   // console.log(request.body);
   // response.send("OK Frontend");
   response.redirect("back"); // tuc la quay ve lai trang [GET] /admin/products/edit
}
// ----------------End []------------------- //