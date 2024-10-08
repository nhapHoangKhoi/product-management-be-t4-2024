const ProductCategoryModel = require("../../models/product-category.model.js");
const systemConfigs = require("../../config/system.js");
const filterStatusHelper = require("../../helpers/filterByStatus.helper.js");
const paginationHelper = require("../../helpers/pagination.helper.js");

// ----------------[GET]------------------- //
// [GET] /admin/product-categories/
module.exports.index = async (request, response) => 
{
   // ----- Filter by status ----- //
   const productCategoryFind = filterStatusHelper.filterByStatus(request);
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
   // ----- End filter by status ----- //


   // ----- Pagination ----- //
   const itemsLimited = 4;
   const pagination = await paginationHelper.paging(request, productCategoryFind, itemsLimited, ProductCategoryModel); // { currentPage: 1, itemsLimited: 4, startIndex: 0, totalPage: 5 }
   // ----- End pagination -----//


   const listOfCategories = await ProductCategoryModel
      .find(productCategoryFind)
      .limit(pagination.itemsLimited)
      .skip(pagination.startIndex);

   response.render(
      "admin/pages/product-categories/index.pug", 
      {
         pageTitle: "Danh mục sản phẩm",
         listOfCategories: listOfCategories,
         filterStatusForFE: filterStatusForFE,
         pagination: pagination
      }
   );
}

// [GET] /admin/product-categories/create
module.exports.getCreatePage = (request, response) =>
{
   response.render(
      "admin/pages/product-categories/create.pug", 
      {
         pageTitle: "Thêm mới danh mục sản phẩm"
      }
   );
}
// ----------------End [GET]------------------- //


// ----------------[POST]------------------- //
// [POST] /admin/product-categories/create
module.exports.createCategory = async (request, response) =>
{
   // ----- Make sure the data type is correct with the Model : Number, String,... ----- //   
   if(request.body.position) {
      request.body.position = parseInt(request.body.position);
   }
   else {
      const numberOfCategories = await ProductCategoryModel.countDocuments({});
      request.body.position = numberOfCategories + 1;
   }
   // ----- End make sure the data type is correct with the Model : Number, String,... ----- //

   
   const newCategoryModel = new ProductCategoryModel(request.body);
   await newCategoryModel.save();

   request.flash("success", "Thêm mới danh mục thành công!");
   response.redirect(`/${systemConfigs.prefixAdmin}/product-categories`);
}
// ----------------End [POST]------------------- //


// ----------------[PATCH]------------------- //
// ----------------End [PATCH]------------------- //


// ----------------[DELETE]------------------- //
// ----------------End [DELETE]------------------- //