const ProductModel = require("../../models/product.model");

// ----------------[]------------------- //
// [GET] /search
module.exports.index = async (request, response) => 
{
   const itemFind = {
      status: "active",
      deleted: false
   };
   
   let listProducts = []; // if no inputKeyword, the listProducts is [], not show all the products
   
   // ----- Search products (co ban) ----- //
   const keyword = request.query.inputKeyword;
   if(keyword) {
      const regex = new RegExp(request.query.inputKeyword, "i");
      itemFind.title = regex;

      listProducts = await ProductModel.find(itemFind);

      // ----- Calculate and add newN key "priceew" ----- //
      for(aProduct of listProducts) {
         aProduct.priceNew = (aProduct.price - (aProduct.price * aProduct.discountPercentage/100)).toFixed(0);
      }
      // ----- End calculate and add new key "priceNew" ----- //
   }
   // ----- End search products (co ban) ----- //


   
   response.render(
      "client/pages/search/index.pug", 
      {
         pageTitle: "Tìm kiếm",
         inputKeyword: keyword,
         listProducts: listProducts
      }
   );
}
// ----------------End []------------------- //