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


   // ----- Pagination

   // { currentPage: 1, limitItems: 4, startIndex: 0, totalPage: 5 }
   const pagination = {
      currentPage: 1,
      limitItems: 4
   };

   if(request.query.page) {
      pagination.currentPage = parseInt(request.query.page);
   }

   pagination.startIndex = (pagination.currentPage - 1) * pagination.limitItems;

   const totalProductsCounted = await ProductModel.countDocuments(productFind);
   const totalPage = Math.ceil(totalProductsCounted / pagination.limitItems);
   pagination.totalPage = totalPage;


   // ----- End pagination


   const listOfProducts = await ProductModel
      .find(productFind)
      .limit(pagination.limitItems)
      .skip(pagination.startIndex);

   response.render(
      "admin/pages/products/index.pug", 
      {
         pageTitle: "Quản lý sản phẩm",
         listOfProducts: listOfProducts,
         keyword: keyword,
         filterStatusForFE: filterStatusForFE,
         pagination: pagination
      }
   );
}

// [POST] /admin/products/create
// ...