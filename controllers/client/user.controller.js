const UserModel = require("../../models/user.model");

const md5 = require("md5");
const generateHelper = require("../../helpers/generate.helper.js");

// ----------------[]------------------- //
// [GET] /user/register
module.exports.getRegisterPage = async (request, response) => 
{
   response.render(
      "client/pages/user/register.pug", 
      {
         pageTitle: "Đăng ký tài khoản"
      }
   );
}

// [POST] /user/register
module.exports.registerUserAccount = async (request, response) =>
{
   // ----- Check existed email ----- //
   const existedUser = await UserModel.findOne(
      {
         email: request.body.email,
         deleted: false
      }
   );

   if(existedUser) {
      request.flash("error", "Email đã tồn tại!");
      response.redirect("back"); // go back to page [GET] /user/register
      return;
   }
   // ----- End check existed email ----- //


   const userData = {
      fullName: request.body.fullName,
      email: request.body.email,
      password: md5(request.body.password), // encrypt password
      tokenUser: generateHelper.generateToken(30) // generate random token
   };


   // ----- Store that user data into database ----- //
   const newUserModel = new UserModel(userData);
   await newUserModel.save();
   // ----- End store that user data into database ----- //


   // ----- Store "token" in the cookie of the user ----- //
   const expiredDays = 1 * 24 * 60 * 60 * 1000; // 1 day

   // tra ve token la de xac thuc la nguoi ta da dang nhap thanh cong roi (thay cho buoc dang nhap)
   response.cookie(
      "tokenUser",
      userData.tokenUser,
      { 
         expires: new Date(Date.now() + expiredDays) 
      }
   );
   // ----- End store "token" in the cookie of the user ----- //


   request.flash("success", "Tạo tài khoản mới thành công!");
   response.redirect("/");
}
// ----------------End []------------------- //


// ----------------[]------------------- //
// [GET] /user/login
module.exports.getLoginPage = async (request, response) => 
{
   response.render(
      "client/pages/user/login.pug", 
      {
         pageTitle: "Đăng nhập tài khoản"
      }
   );
}

// [POST] /user/login
module.exports.loginUserAccount = async (request, response) =>
{
   const inputEmail = request.body.email;
   const inputPassword = request.body.password;

   const theAccount = await UserModel.findOne(
      {
         email: inputEmail,
         deleted: false
      }
   );

   if(!theAccount) {
      request.flash("error", "Email không tồn tại!");
      response.redirect("back"); // go back to page [GET] /user/login
      return;
   }

   if(md5(inputPassword) != theAccount.password) {
      request.flash("error", "Email hoặc mật khẩu không đúng!");
      response.redirect("back"); // go back to page [GET] /user/login
      return;
   }

   if(theAccount.status != "active") {
      request.flash("error", "Tài khoản đang bị khoá!");
      response.redirect("back"); // go back to page [GET] /user/login
      return;
   }

   // ----- Store "token" in the cookie of the user ----- //
   const expiredDays = 1 * 24 * 60 * 60 * 1000; // 1 days

   response.cookie(
      "tokenUser",
      theAccount.tokenUser,
      { 
         expires: new Date(Date.now() + expiredDays) 
      }
   );
   // ----- End store "token" in the cookie of the user ----- //

   response.redirect("/");
}
// ----------------End []------------------- //


// ----------------[]------------------- //
// [GET] /user/logout
module.exports.logout = (request, response) =>
{
   response.clearCookie("tokenUser");
   response.redirect("/user/login");
}
// ----------------End []------------------- //