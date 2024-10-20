const UserModel = require("../../models/user.model.js");
const ForgotPasswordModel = require("../../models/forgot-password.model.js");

const md5 = require("md5");
const generateHelper = require("../../helpers/generate.helper.js");
const sendEmailHelper = require("../../helpers/sendEmail.helper.js");

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


// ----------------[]------------------- //
// [GET] /user/password/forgot
module.exports.getForgotPasswordPage = async (request, response) => 
{
   response.render(
      "client/pages/user/forgot-password.pug", 
      {
         pageTitle: "Lấy lại mật khẩu"
      }
   );
}

// [POST] /user/password/forgot
module.exports.forgotPassword = async (request, response) => 
{
   const inputEmail = request.body.email;

   // ----- Check existed email ----- //
   const existedUser = await UserModel.findOne(
      {
         email: inputEmail,
         deleted: false
      }
   );

   if(!existedUser) {
      request.flash("error", "Email không tồn tại trong hệ thống!");
      response.redirect("back"); // go back to page [GET] /user/password/forgot
      return;
   }
   // ----- End check existed email ----- //


   // ----- Buoc 1 : Store email, OTP into database ----- //
   const expireAfter = 3 * 60 * 1000; // 3 minutes (in miliseconds)
   const otp = generateHelper.generateRandomNumber(6);

   const duplicatedForgotEmail = await ForgotPasswordModel.findOne(
      {
         email: inputEmail
      }
   );
   
   if(duplicatedForgotEmail) {
      await ForgotPasswordModel.deleteMany(
         {
            email: inputEmail
         }
      );
   }
   
   const forgotPasswordData = {
      email: inputEmail,
      otp: otp,
      expireAt: Date.now() + expireAfter
   };
   
   const newForgotPasswordModel = new ForgotPasswordModel(forgotPasswordData);
   await newForgotPasswordModel.save();
   // ----- End buoc 1 : Store email, OTP into database ----- //


   // ----- Buoc 2 : Automatically send OTP through user's email ----- //
   const subject = "OTP - Reset password";
   const content = `Mã OTP xác thực của bạn là: <b style="color: red;">${otp}</b>. Mã OTP có hiệu lực trong 3 phút. Vui lòng không cung cấp mã OTP cho người khác`;

   sendEmailHelper.sendEmail(inputEmail, subject, content);
   // ----- End buoc 2 : Automatically send OTP through user's email ----- //


   // ----- Buoc 3 : Navigate to "type_in_OTP" page ----- // 
   response.redirect(`/user/password/otp?email=${inputEmail}`);
   // ----- Ed buoc 3 : Navigate to "type_in_OTP" page ----- // 
}

// [GET] /user/password/otp
module.exports.getOtpPasswordPage = async (request, response) => 
{
   const email = request.query.email;

   response.render(
      "client/pages/user/otp-password.pug", 
      {
         pageTitle: "Xác thực OTP",
         email: email
      }
   );
}

// [POST] /user/password/otp
module.exports.otpPassword = async (request, response) => 
{
   const email = request.body.email;
   const otp = request.body.otp;

   const comparedData = await ForgotPasswordModel.findOne(
      {
         email: email,
         otp: otp
      }
   );

   if(!comparedData) {
      request.flash("error", "OTP không hợp lệ!");
      response.redirect("back"); // go back to page [GET] /user/password/otp
      return;
   }

   // ----- Return "token" in the cookie of the user ----- //
   const theUser = await UserModel.findOne(
      {
         email: email
      }
   );

   const expiredDays = 1 * 24 * 60 * 60 * 1000; // 1 days

   response.cookie(
      "tokenUser",
      theUser.tokenUser,
      { 
         expires: new Date(Date.now() + expiredDays) 
      }
   );

   response.redirect("/user/password/reset");
   // ----- End return "token" in the cookie of the user ----- //
}

// [GET] /user/password/reset
module.exports.getResetPasswordPage = async (request, response) => 
{
   response.render(
      "client/pages/user/reset-password.pug", 
      {
         pageTitle: "Đổi mật khẩu mới"
      }
   );
}

// [PATCH] /user/password/reset
module.exports.resetPassword = async (request, response) => 
{
   const newPassword = request.body.password;
   const tokenUser = request.cookies.tokenUser;

   await UserModel.updateOne(
      {
         tokenUser: tokenUser,
         deleted: false
      },
      {
         password: md5(newPassword)
      }
   );

   request.flash("success", "Đổi mật khẩu thành công!");
   response.redirect("/");
}
// ----------------End []------------------- //