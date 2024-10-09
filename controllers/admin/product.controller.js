const ProductModel = require("../../models/product.model.js");
const ProductCategoryModel = require("../../models/product-category.model.js");

const systemConfigs = require("../../config/system.js");
const paginationHelper = require("../../helpers/pagination.helper.js");
const filterStatusHelper = require("../../helpers/filterByStatus.helper.js");
const searchCoBanHelper = require("../../helpers/searchCoBan.helper.js");
const createHierarchyHelper = require("../../helpers/createHierarchy.helper.js");

// ----------------[]------------------- //
// [GET] /admin/products/
module.exports.index = async (request, response) => 
{
   // ----- Filter by status ----- //
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
   // ----- End filter by status ----- //


   // ----- Sort ----- //
   const productSortBy = {
      // position: "desc",
      // price: "desc",
      // title: "asc"
   };

   // vi du : sortKey=price&sortValue=desc
   if(request.query.sortKey && request.query.sortValue) 
   {
      productSortBy[request.query.sortKey] = request.query.sortValue; // title=desc, price=desc,...
   }
   else {
      productSortBy.position = "desc"; // mac dinh neu ko co yeu cau sort khac
   }
   // ----- End sort ----- //


   // ----- Search products ----- //
   const objectSearchResult = searchCoBanHelper.search(request, productFind);
   let keyword = "";

   if(objectSearchResult) {
      productFind.title = objectSearchResult.productFindTitle;
      keyword = objectSearchResult.keyword;
   }
   // ----- End search products ----- //


   // ----- Pagination ----- //
   const itemsLimited = 4;
   const pagination = await paginationHelper.paging(request, productFind, itemsLimited, ProductModel); // { currentPage: 1, itemsLimited: 4, startIndex: 0, totalPage: 5 }
   // ----- End pagination -----//


   const listOfProducts = await ProductModel
      .find(productFind)
      .limit(pagination.itemsLimited)
      .skip(pagination.startIndex)
      .sort(productSortBy);

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

// [GET] /admin/products/detail/:idProduct
module.exports.getDetailPage = async (request, response) =>
{
   try {
      const productId = request.params.idProduct;

      const productFind = {
         _id: productId,
         deleted: false
      };
   
      const theProductData = await ProductModel.findOne(productFind); 

      if(theProductData) // check != null, vi co render ra giao dien nen them if else cho nay nua
      {
         response.render(
            "admin/pages/products/detail.pug",
            {
               pageTitle: "Chi tiết sản phẩm",
               theProductData: theProductData
            }
         );
      }
      else 
      {
         response.redirect(`/${systemConfigs.prefixAdmin}/products`);
      }
   }
   catch(error) {
      // catch la do nguoi ta hack, pha
      // console.log(error)
      request.flash("error", "ID sản phẩm không hợp lệ!");
      response.redirect(`/${systemConfigs.prefixAdmin}/products`);
   }
}

// [PATCH] /admin/products/change-status/:statusChange/:idProduct
module.exports.changeStatus = async (request, response) =>
{
   try {
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
   
      request.flash("success", "Cập nhật trạng thái thành công!"); // chi la dat ten key "success"

      response.json(
         {
            code: 200
         }
      );
   } 
   catch(error) {
      response.redirect("back"); // back to page [GET] /admin/products/
   }
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

   switch(selectedValue)
   {
      case "active":
      case "inactive":
         await ProductModel.updateMany(
            {
               _id: listOfIds
            }, 
            {
               status: selectedValue
            }
         );
         request.flash("success", "Cập nhật sản phẩm thành công!"); // chi la dat ten key "success"
         break;

      case "deleteSoftManyItems":
         await ProductModel.updateMany(
            {
               _id: listOfIds
            },
            {
               deleted: true
            }
         );
         request.flash("success", "Xoá sản phẩm thành công!"); // chi la dat ten key "success"
         break;

      case "recoverManyItems":
         await ProductModel.updateMany(
            {
               _id: listOfIds
            },
            {
               deleted: false
            }
         );
         request.flash("success", "Khôi phục sản phẩm thành công!"); // chi la dat ten key "success"
         break;
      
      default:
         break;
   }

   response.json(
      {
         code: 200
      }
   );
}

// [PATCH] /admin/products/delete/:idProduct
module.exports.softDeleteProduct = async (request, response) => 
{
   try {
      const productId = request.params.idProduct;
   
      await ProductModel.updateOne(
         {
            _id: productId
         },
         {
            deleted: true
         }
      );
   
      request.flash("success", "Xoá sản phẩm thành công!"); // chi la dat ten key "success"
   
      response.json(
         {
            code: 200
         }
      );
   }
   catch(error) {
      response.redirect("back"); // back to page [GET] /admin/products/
   }
}

// [PATCH] /admin/products/change-position/:idProduct
module.exports.changeProductPosition = async (request, response) =>
{
   try {
      const productId = request.params.idProduct;
      const itemPosition = request.body.itemPosition;
   
      await ProductModel.updateOne(
         {
            _id: productId
         },
         {
            position: itemPosition
         }
      );
   
      response.json(
         {
            code: 200
         }
      );
   }
   catch(error) {
      response.redirect("back"); // back to page [GET] /admin/products/
   }
}
// ----------------End []------------------- //


// ----------------[]------------------- //
// [GET] /admin/products/create
module.exports.getCreatePage = async (request, response) =>
   {
      // ----- Hierarchy dropdown ----- //
      const allCategoriesFind = {
         deleted: false
      };
      const listOfCategories = await ProductCategoryModel.find(allCategoriesFind); 
      
      const hierarchyCategories = createHierarchyHelper(listOfCategories);
      // ----- End hierarchy dropdown ----- //
      
      
      response.render(
         "admin/pages/products/create.pug",
         {
            pageTitle: "Thêm mới sản phẩm",
            listOfCategories: hierarchyCategories
      }
   );
}

// [POST] /admin/products/create
module.exports.createProduct = async (request, response) =>
{
   // ----- Make sure the data type is correct with the Model : Number, String,... ----- //
   request.body.price = parseFloat(request.body.price);
   request.body.discountPercentage = parseFloat(request.body.discountPercentage);
   request.body.stock = parseInt(request.body.stock);
   
   if(request.body.position) {
      request.body.position = parseInt(request.body.position);
   }
   else {
      const numberOfProducts = await ProductModel.countDocuments({});
      request.body.position = numberOfProducts + 1;
   }
   // ----- End make sure the data type is correct with the Model : Number, String,... ----- //

   
   const newProductModel = new ProductModel(request.body);
   await newProductModel.save();

   request.flash("success", "Thêm mới sản phẩm thành công!");
   response.redirect(`/${systemConfigs.prefixAdmin}/products`);
}
// ----------------End []------------------- //


// ----------------[]------------------- //
// [GET] /admin/products/edit/:idProduct
module.exports.getEditPage = async (request, response) =>
{
   try {
      const productId = request.params.idProduct;

      const productFind = {
         _id: productId,
         deleted: false
      };
   
      const theProductData = await ProductModel.findOne(productFind); 

      if(theProductData) // check != null, vi co render ra giao dien nen them if else cho nay nua
      {
         // ----- Hierarchy dropdown ----- //
         const allCategoriesFind = {
            deleted: false
         };
         const listOfCategories = await ProductCategoryModel.find(allCategoriesFind); 
         const hierarchyCategories = createHierarchyHelper(listOfCategories);
         // ----- End hierarchy dropdown ----- //

         response.render(
            "admin/pages/products/edit.pug",
            {
               pageTitle: "Chỉnh sửa sản phẩm",
               theProductData: theProductData,
               listOfCategories: hierarchyCategories
            }
         );
      }
      else 
      {
         response.redirect(`/${systemConfigs.prefixAdmin}/products`);
      }
   }
   catch(error) {
      // catch la do nguoi ta hack, pha
      // console.log(error)
      request.flash("error", "ID sản phẩm không hợp lệ!");
      response.redirect(`/${systemConfigs.prefixAdmin}/products`);
   }
}

// [PATCH] /admin/products/edit/:idProduct
module.exports.editProduct = async (request, response) =>
{
   try {
      const productId = request.params.idProduct;
   
      // ----- Make sure the data type is correct with the Model : Number, String,... ----- //
      request.body.price = parseFloat(request.body.price);
      request.body.discountPercentage = parseFloat(request.body.discountPercentage);
      request.body.stock = parseInt(request.body.stock);
      
      if(request.body.position) {
         request.body.position = parseInt(request.body.position);
      }
      else {
         const numberOfProducts = await ProductModel.countDocuments({});
         request.body.position = numberOfProducts + 1;
      }
      // ----- End make sure the data type is correct with the Model : Number, String,... ----- //


      await ProductModel.updateOne(
         {
            _id: productId
         },
         request.body
      );
   
      request.flash("success", "Cập nhật sản phẩm thành công!");
   }
   catch(error) {
      request.flash("error", "ID sản phẩm không hợp lệ!");
   }

   // response.send("OK Frontend");
   response.redirect("back"); // tuc la quay ve lai trang [GET] /admin/products/edit
}
// ----------------End []------------------- //


// ----------------[]------------------- //
// [GET] /admin/products/trash
module.exports.getDeletedProducts = async (request, response) =>
{
   const deletedProductFind = {
      deleted: true
   };

   // ----- Pagination ----- //
   const limitItems = 10;
   const pagination = await paginationHelper.paging(request, deletedProductFind, limitItems, ProductModel); // { currentPage: 1, limitItems: 10, startIndex: 0, totalPage:... }
   // ----- End pagination -----//
   

   const listOfDeletedProducts = await ProductModel
      .find(deletedProductFind)
      .limit(pagination.itemsLimited)
      .skip(pagination.startIndex);

   response.render(
      "admin/pages/products/trash.pug",
      {
         listOfDeletedProducts: listOfDeletedProducts,
         pagination: pagination
      }
   );
}

// [PATCH] /admin/products/recover/:idProduct
module.exports.recoverProduct = async (request, response) => 
{
   try {
      const productId = request.params.idProduct;
   
      await ProductModel.updateOne(
         {
            _id: productId
         },
         {
            deleted: false
         }
      );
   
      request.flash("success", "Khôi phục sản phẩm thành công!"); // chi la dat ten key "success"
   
      response.json(
         {
            code: 200
         }
      );
   }
   catch(error) {
      response.redirect("back"); // back to page [GET] /admin/products/trash
   }
}

// [DELETE] /admin/products/delete-permanent/:idProduct
module.exports.permanentDeleteProduct = async (request, response) =>
{
   try {
      const productId = request.params.idProduct;
   
      await ProductModel.deleteOne(
         {
            _id: productId
         }
      );
   
      response.json(
         {
            code: 200
         }
      );
   }
   catch(error) {
      response.redirect("back"); // back to page [GET] /admin/products/trash
   }
}

// [DELETE] /admin/products/delete-many-permanent
module.exports.permanentDeleteManyProducts = async (request, response) =>
{
   const { selectedValue, listOfIds } = request.body;

   if(selectedValue == "deletePermanentManyItems") {
      await ProductModel.deleteMany(
         {
            _id: listOfIds
         }
      );
   }

   response.json(
      {
         code: 200
      }
   );
}
// ----------------End []------------------- //