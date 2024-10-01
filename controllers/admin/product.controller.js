const ProductModel = require("../../models/product.model.js");

// [GET] /admin/products/
module.exports.index = async (request, response) => 
{
   const listOfProducts = await ProductModel.find(
      {
         deleted: false
      }
   );

   response.render(
      "admin/pages/products/index.pug", 
      {
         pageTitle: "Quản lý sản phẩm",
         listOfProducts: listOfProducts
      }
   );
}

// [POST] /admin/products/create
// ...