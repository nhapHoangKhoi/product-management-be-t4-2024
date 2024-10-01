const dashboardRoute = require("./dashboard.route.js");

module.exports.index = (app) =>
{
   app.use("/admin/dashboard", dashboardRoute);
}