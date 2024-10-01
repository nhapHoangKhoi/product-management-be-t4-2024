const dashboardRoute = require("./dashboard.route.js");
const productAdminRoute = require("./product.route.js");

module.exports.index = (app) =>
{
   app.use("/admin/dashboard", dashboardRoute);
   app.use("/admin/products", productAdminRoute);
}