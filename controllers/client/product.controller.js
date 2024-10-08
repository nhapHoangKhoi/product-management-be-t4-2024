const ProductModel = require("../../models/product.model.js");

// ----------------[GET]------------------- //
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

   for(aProduct of listOfProducts) {
      aProduct.priceNew = (aProduct.price - (aProduct.price * aProduct.discountPercentage/100)).toFixed(0);
   }

   response.render(
      "client/pages/products/index.pug", 
      {
         pageTitle: "Danh sách sản phẩm",
         listOfProducts: listOfProducts
      }
   );
}

// [GET] /products/:slug
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
// ----------------End [GET]------------------- //


// ----------------[POST]------------------- //
// ----------------End [POST]------------------- //


// ----------------[PATCH]------------------- //
// ----------------End [PATCH]------------------- //


// ----------------[DELETE]------------------- //
// ----------------End [DELETE]------------------- //