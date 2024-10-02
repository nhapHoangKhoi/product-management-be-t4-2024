const ProductModel = require("../../models/product.model.js");

// [GET] /admin/products/
module.exports.index = async (request, response) => 
{
   // ----- Filter by status

   const productFind = {
      deleted: false
   };

   // {status: "active"}
   // {status: "inactive"}
   // {status: undefined}
   if(request.query.status) {
      productFind.status = request.query.status;
   }

   // ----- End filter by status


   // ----- Search item

   let keyword = "";
   
   if(request.query.inputKeyword) 
   {
      const regex = new RegExp(request.query.inputKeyword, "i");
      productFind.title = regex;

      keyword = request.query.inputKeyword;
   }

   // ----- End search item


   const listOfProducts = await ProductModel.find(productFind);

   response.render(
      "admin/pages/products/index.pug", 
      {
         pageTitle: "Quản lý sản phẩm",
         listOfProducts: listOfProducts,
         keyword: keyword
      }
   );
}

// [POST] /admin/products/create
// ...