const systemConfigs = require("../../config/system.js");
const dashboardRoute = require("./dashboard.route.js");
const productAdminRoute = require("./product.route.js");
const productCategoryAdminRoute = require("./product-category.route.js");
const roleRoute = require("./role.route.js");
const accountRoute = require("./account.route.js");
const authenRoute = require("./authen.route.js");

// tao route
module.exports.index = (app) =>
{
   const path = `/${systemConfigs.prefixAdmin}`;

   app.use(`${path}/dashboard`, dashboardRoute);
   app.use(`${path}/products`, productAdminRoute);
   app.use(`${path}/product-categories`, productCategoryAdminRoute);
   app.use(`${path}/roles`, roleRoute);
   app.use(`${path}/accounts`, accountRoute);
   app.use(`${path}/authen`, authenRoute);
}