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

// [PATCH] /admin/products/change-status/:statusChange/:idProduct
// cap nhat dung phuong thuc PATCH
module.exports.changeStatus = async (request, response) =>
{
   const { idProduct, statusChange } = request.params; // { statusChange: '...', idProduct: '...' }
   
   // cap nhat data trong database
   // day la cua mongoose, ko lien quan gi toi phuong thuc GET, PATCH,...
   await ProductModel.updateOne(
      {
         _id: idProduct
      }, 
      {
         status: (statusChange == "active") ? "inactive" : "active"
      }
   );

   response.json(
      {
         code: 200
      }
   );
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (request, response) =>
{
   // console.log(request.body);
   // {
   //    selectedValue: 'active',
   //    listOfIds: [ '66f972ce307bea1ebe5e8fe5', '66f972ce307bea1ebe5e8fe6' ]
   // }

   const { selectedValue, listOfIds } = request.body;

   await ProductModel.updateMany(
      {
         _id: listOfIds
      }, 
      {
         status: selectedValue
      }
   );

   response.json(
      {
         code: 200
      }
   );
}



// [POST] /admin/products/create
// ...