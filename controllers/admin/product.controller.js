const ProductModel = require("../../models/product.model.js");
const paginationHelper = require("../../helpers/pagination.helper.js");
const filterStatusHelper = require("../../helpers/filterByStatus.helper.js");
const searchCoBanHelper = require("../../helpers/searchCoBan.helper.js");

// [GET] /admin/products/
module.exports.index = async (request, response) => 
{
   // ----- Filter by status

   const productFind = filterStatusHelper.filterByStatus(request);

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

   const objectSearchResult = searchCoBanHelper.search(request, productFind);
   let keyword = "";

   if(objectSearchResult) {
      productFind.title = objectSearchResult.productFindTitle;
      keyword = objectSearchResult.keyword;
   }

   // ----- End search products


   // ----- Pagination
   
   const pagination = await paginationHelper.paging(request, productFind); // { currentPage: 1, limitItems: 4, startIndex: 0, totalPage: 5 }

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

// [GET] /admin/products/change-status/:statusChange/:idProduct
module.exports.changeStatus = async (request, response) =>
{
   // console.log(request.params); 
   // { statusChange: '...', idProduct: '...' }
   const { idProduct, statusChange } = request.params;
   await ProductModel.updateOne(
      {
         _id: idProduct
      }, 
      {
         status: (statusChange == "active") ? "inactive" : "active"
      }
   );

   response.redirect("back");
}


// [POST] /admin/products/create
// ...