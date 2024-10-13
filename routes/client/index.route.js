// route cha, route cap cao nhat

// viet ham, cu phap ES6
// export const index = () => {...}
//
// viet ham, cu phap common JS
// de viet JS o trong NodeJS

const homeRoute = require("./home.route.js");
const productRoute = require("./product.route.js");

const categoryProductMiddleware = require("../../middlewares/client/category-product.middleware.js");

// tao route
module.exports.index = (app) =>
{
   app.use(categoryProductMiddleware.categoryProduct);

   app.use("/", homeRoute);
   app.use("/products", productRoute);
}