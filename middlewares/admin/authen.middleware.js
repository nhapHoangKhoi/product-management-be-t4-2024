const systemConfigs = require("../../config/system.js");
const AccountModel = require("../../models/account.model.js");

module.exports.checkAuthen = async (request, response, next) =>
{
   if(!request.cookies.token) {
      response.redirect(`/${systemConfigs.prefixAdmin}/authen/login`);
      return;
   }

   const adminAccount = await AccountModel.findOne(
      {
         token: request.cookies.token,
         deleted: false
      }
   );

   if(!adminAccount) {
      response.redirect(`/${systemConfigs.prefixAdmin}/authen/login`);
      return;
   }

   next();
}