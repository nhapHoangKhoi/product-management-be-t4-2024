const ProductModel = require("../../models/product.model.js");

// [GET] /products/
module.exports.index = async (request, response) => 
{
   const listOfProducts = await ProductModel.find(
      {
         status: "active",
         deleted: false
      }
   );

   for(aProduct of listOfProducts) {
      aProduct.priceNew = (aProduct.price - (aProduct.price * aProduct.discountPercentage/100)).toFixed(0);
   }

   response.render("client/pages/products/index.pug", {
      pageTitle: "Danh sách sản phẩm",
      listOfProducts: listOfProducts
   });
}

// [POST] /products/create
// ...