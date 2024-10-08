const ProductCategoryModel = require("../../models/product-category.model.js");
const systemConfigs = require("../../config/system.js");

// ----------------[GET]------------------- //
// [GET] /admin/product-categories/
module.exports.index = (request, response) => {
   response.render(
      "admin/pages/product-categories/index.pug", 
      {
         pageTitle: "Danh mục sản phẩm"
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