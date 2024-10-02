const ProductModel = require("../../models/product.model.js");

// [GET] /admin/products/
module.exports.index = async (request, response) => 
{
   const productFind = {
      deleted: false
   };

   if(request.query.status) {
      productFind.status = request.query.status;
   }

   const listOfProducts = await ProductModel.find(productFind);

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