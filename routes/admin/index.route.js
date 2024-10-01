const systemConfigs = require("../../config/system.js");
const dashboardRoute = require("./dashboard.route.js");
const productAdminRoute = require("./product.route.js");

// tao route
module.exports.index = (app) =>
{
   const path = `/${systemConfigs.prefixAdmin}`;

   app.use(`${path}/dashboard`, dashboardRoute);
   app.use(`${path}/products`, productAdminRoute);
}