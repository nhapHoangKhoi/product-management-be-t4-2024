const ProductModel = require("../../models/product.model.js");
const systemConfigs = require("../../config/system.js");
const paginationHelper = require("../../helpers/pagination.helper.js");
const filterStatusHelper = require("../../helpers/filterByStatus.helper.js");
const searchCoBanHelper = require("../../helpers/searchCoBan.helper.js");

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
   const pagination = await paginationHelper.paging(request, productFind, itemsLimited); // { currentPage: 1, itemsLimited: 4, startIndex: 0, totalPage: 5 }
   // ----- End pagination -----//


   const listOfProducts = await ProductModel
      .find(productFind)
      .limit(pagination.itemsLimited)
      .skip(pagination.startIndex)
      .sort(
         {
            position: "desc"
         }
      );

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

// [GET] /admin/products/trash
module.exports.getDeletedProducts = async (request, response) =>
{
   const deletedProductFind = {
      deleted: true
   };

   // ----- Pagination ----- //
   const limitItems = 10;
   const pagination = await paginationHelper.paging(request, deletedProductFind, limitItems); // { currentPage: 1, limitItems: 10, startIndex: 0, totalPage:... }
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

// [GET] /admin/products/create
module.exports.getCreatePage = (request, response) =>
{
   response.render(
      "admin/pages/products/create.pug",
      {
         pageTitle: "Thêm mới sản phẩm"
      }
   );
}

// [POST] /admin/products/create
module.exports.createProduct = async (request, response) =>
{
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

   const newProductModel = new ProductModel(request.body);
   await newProductModel.save();

   response.redirect(`/${systemConfigs.prefixAdmin}/products`);
}

// [PATCH] /admin/products/change-status/:statusChange/:idProduct
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

   request.flash("success", "Cập nhật trạng thái thành công!"); // chi la dat ten key "success"

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
         break;

      case "deleteManyItems":
         await ProductModel.updateMany(
            {
               _id: listOfIds
            },
            {
               deleted: true
            }
         );
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
   const productId = request.params.idProduct;

   await ProductModel.updateOne(
      {
         _id: productId
      },
      {
         deleted: true
      }
   );

   request.flash("success", "Xóa sản phẩm thành công!"); // chi la dat ten key "success"

   response.json(
      {
         code: 200
      }
   );
}

// [PATCH] /admin/products/recover/:idProduct
module.exports.recoverProduct = async (request, response) => 
{
   const productId = request.params.idProduct;

   await ProductModel.updateOne(
      {
         _id: productId
      },
      {
         deleted: false
      }
   );

   response.json(
      {
         code: 200
      }
   );
}

// [PATCH] /admin/products/change-position/:idProduct
module.exports.changeProductPosition = async (request, response) =>
{
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

// [DELETE] /admin/products/delete-permanent/:idProduct
module.exports.permanentDeleteProduct = async (request, response) =>
{
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


// [POST] /admin/products/create
// ...