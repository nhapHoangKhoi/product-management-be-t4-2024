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

   const filterStatusForFE = [
      {
         label: "Tất cả",
         value: ""
      },
      {
         label: "Hoạt động",
         value: "active"
      },
      {
         label: "Dừng hoạt động",
         value: "inactive"
      }
   ];

   // ----- End filter by status


   // ----- Search products

   let keyword = "";
   
   if(request.query.inputKeyword) 
   {
      const regex = new RegExp(request.query.inputKeyword, "i");
      productFind.title = regex;

      keyword = request.query.inputKeyword;
   }

   // ----- End search products


   const listOfProducts = await ProductModel.find(productFind);

   response.render(
      "admin/pages/products/index.pug", 
      {
         pageTitle: "Quản lý sản phẩm",
         listOfProducts: listOfProducts,
         keyword: keyword,
         filterStatusForFE: filterStatusForFE
      }
   );
}

// [POST] /admin/products/create
// ...