const ProductCategoryModel = require("../../models/product-category.model.js");
const systemConfigs = require("../../config/system.js");
const filterStatusHelper = require("../../helpers/filterByStatus.helper.js");
const paginationHelper = require("../../helpers/pagination.helper.js");
const createHierarchyHelper = require("../../helpers/createHierarchy.helper.js");

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
module.exports.getCreatePage = async (request, response) =>
{
   const productCategoryFind = {
      deleted: false
   };


   const listOfCategories = await ProductCategoryModel.find(productCategoryFind); 

   // ----- Hierarchy dropdown ----- //
   const hierarchyCategories = createHierarchyHelper(listOfCategories);
   // ----- End hierarchy dropdown ----- //


   response.render(
      "admin/pages/product-categories/create.pug", 
      {
         pageTitle: "Thêm mới danh mục sản phẩm",
         listOfCategories: hierarchyCategories
      }
   );
}

// [GET] /admin/product-categories/edit/:idCategory
module.exports.getEditPage = async (request, response) =>
{
   try {
      // ----- Data of the specific category ----- //
      const categoryId = request.params.idCategory;
      
      const theCategoryFind = {
         _id: categoryId,
         deleted: false
      };
      const theCategoryData = await ProductCategoryModel.findOne(theCategoryFind);
      // ----- End data of the specific category ----- //


      const allCategoriesFind = {
         deleted: false
      };

      const listOfCategories = await ProductCategoryModel.find(allCategoriesFind); 
   
      // ----- Hierarchy dropdown ----- //
      const hierarchyCategories = createHierarchyHelper(listOfCategories);
      // ----- End hierarchy dropdown ----- //
   
      
      if(hierarchyCategories) // check != null, vi co render ra giao dien nen them if else cho nay nua
      {
         response.render(
            "admin/pages/product-categories/edit.pug", 
            {
               pageTitle: "Chỉnh sửa danh mục sản phẩm",
               listOfCategories: hierarchyCategories,
               theCategoryData: theCategoryData
            }
         );
      }
      else 
      {
         response.redirect(`/${systemConfigs.prefixAdmin}/product-categories`);
      }
   }
   catch(error) {
      // catch la do nguoi ta hack, pha
      // console.log(error)
      request.flash("error", "ID sản phẩm không hợp lệ!");
      response.redirect(`/${systemConfigs.prefixAdmin}/product-categories`);
   }
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
// [PATCH] /admin/product-categories/edit/:idCategory
module.exports.editCategory = async (request, response) =>
{
   try {
      const categoryId = request.params.idCategory;

      // ----- Make sure the data type is correct with the Model : Number, String,... ----- //   
      if(request.body.position) {
         request.body.position = parseInt(request.body.position);
      }
      else {
         const numberOfCategories = await ProductCategoryModel.countDocuments({});
         request.body.position = numberOfCategories + 1;
      }
      // ----- End make sure the data type is correct with the Model : Number, String,... ----- //

      await ProductCategoryModel.updateOne(
         {
            _id: categoryId
         },
         request.body
      );
   
      request.flash("success", "Cập nhật danh mục thành công!");
   }
   catch(error) {
      request.flash("error", "ID sản phẩm không hợp lệ!");
   }

   // response.send("OK Frontend");
   response.redirect("back"); // tuc la quay ve lai trang [GET] /admin/product-categories/edit
}
// ----------------End [PATCH]------------------- //


// ----------------[DELETE]------------------- //
// ----------------End [DELETE]------------------- //