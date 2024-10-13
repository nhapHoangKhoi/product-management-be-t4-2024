const ProductCategoryModel = require("../../models/product-category.model.js");
const ProductModel = require("../../models/product.model.js");

// ----------------[]------------------- //
// [GET] /products/
module.exports.index = async (request, response) => 
{
   const listOfProducts = await ProductModel
      .find(
         {
            status: "active",
            deleted: false
         }
      )
      .sort(
         {
            position: "desc"
         }
      )

   // ----- Calculate and add newN key "priceew" ----- //
   for(aProduct of listOfProducts) {
      aProduct.priceNew = (aProduct.price - (aProduct.price * aProduct.discountPercentage/100)).toFixed(0);
   }
   // ----- End calculate and add new key "priceNew" ----- //

   response.render(
      "client/pages/products/index.pug", 
      {
         pageTitle: "Danh sách sản phẩm",
         listOfProducts: listOfProducts
      }
   );
}

// [GET] /products/:slugCategory
module.exports.getProductsByCategory = async (request, response) => 
{
   const slugCategory = request.params.slugCategory;

   const theCorrespondCategoryData = await ProductCategoryModel.findOne(
      {
         slug: slugCategory,
         status: "active",
         deleted: false
      }
   );

   
   // ----- Get all sub-categories as possible ----- //
   const allSubCategories = [];

   const getSubCategories = async (currentCategoryId) => 
   {
      const subCategoriesInEachLevel = await ProductCategoryModel.find(
         {
            parent_id: currentCategoryId,
            status: "active",
            deleted: false
         }
      );

      for(const eachSubCategory of subCategoriesInEachLevel) {
         allSubCategories.push(eachSubCategory.id);
         await getSubCategories(eachSubCategory.id); // recursive
      }
   }

   await getSubCategories(theCorrespondCategoryData.id);
   // ----- End get all sub-categories as possible ----- //
   

   const listOfProducts = await ProductModel
      .find(
         {
            product_category_id: {
               $in: [
                  theCorrespondCategoryData.id,
                  ...allSubCategories
               ]
            },
            status: "active",
            deleted: false
         }
      )
      .sort(
         {
            position: "desc"
         }
      )

   // ----- Calculate and add new key "priceNew" ----- //
   for(aProduct of listOfProducts) {
      aProduct.priceNew = (aProduct.price - (aProduct.price * aProduct.discountPercentage/100)).toFixed(0);
   }
   // ----- End calculate and add new key "priceNew" ----- //

   response.render(
      "client/pages/products/index.pug", 
      {
         pageTitle: theCorrespondCategoryData.title,
         listOfProducts: listOfProducts
      }
   );
}
// ----------------End []------------------- //


// ----------------[]------------------- //
// [GET] /products/detail/:slug
module.exports.getDetailPage = async (request, response) => 
{
   const slug = request.params.slug;
   
   const productFind = {
      slug: slug,
      deleted: false,
      status: "active"
   };

   const theProductData = await ProductModel.findOne(productFind);

   // slug la chi co tim duoc hoac khong tim duoc, 
   // chu ko co truong hop bi loi giong id
   //
   // nen chi can if else la du, ko can try catch
   if(theProductData) {
      response.render(
         "client/pages/products/detail.pug", 
         {
            pageTitle: "Chi tiết sản phẩm",
            theProductData: theProductData
         }
      );
   }
   else {
      response.redirect("/"); // chuyen ve trang chu (trang home) [GET] /
   }
}
// ----------------End []------------------- //