const AccountModel = require("../../models/account.model");

const md5 = require("md5");
const systemConfigs = require("../../config/system.js");

// ----------------[]------------------- //
// [GET] /admin/authen/login
module.exports.getLoginPage = (request, response) => 
{
   response.render(
      "admin/pages/authens/login.pug", 
      {
         pageTitle: "Đăng nhập",
      }
   );
}

// [POST] /admin/authen/login
module.exports.login = async (request, response) => 
{
   const inputEmail = request.body.email;
   const inputPassword = request.body.password;

   const theAccount = await AccountModel.findOne(
      {
         email: inputEmail,
         deleted: false
      }
   );

   if(!theAccount) {
      request.flash("error", "Email không tồn tại trong hệ thống!");
      response.redirect("back"); // go back to page [GET] /admin/authen/login
      return;
   }

   if(md5(inputPassword) != theAccount.password) {
      request.flash("error", "Email hoặc mật khẩu không đúng!");
      response.redirect("back"); // go back to page [GET] /admin/authen/login
      return;
   }

   if(theAccount.status != "active") {
      request.flash("error", "Tài khoản đang bị khoá!");
      response.redirect("back"); // go back to page [GET] /admin/authen/login
      return;
   }

   response.cookie("token", theAccount.token);
   response.redirect(`/${systemConfigs.prefixAdmin}/dashboard`);

   // response.send("OK Frontend");
}
// ----------------End []------------------- //