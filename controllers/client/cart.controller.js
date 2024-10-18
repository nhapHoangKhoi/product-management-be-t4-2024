const CartModel = require("../../models/cart.model");
const ProductModel = require("../../models/product.model");

// ----------------[]------------------- //
// [POST] /cart/add/:productId
// that ra thi o day minh da tao cart o middleware truoc do roi
// nen ban chat o day phuong thuc PATCH cho de hieu
module.exports.addToCart = async (request, response) => 
{
   try {
      const cartId = request.cookies.cartId;
      const productId = request.params.productId;
      const quantity = parseInt(request.body.quantity);

      const theCart = await CartModel.findOne(
         {
            _id: cartId
         }
      );

      const existedProductInCart = theCart.products.find(
         item => item.productId == productId
      );

      if(existedProductInCart) {
         const totalQuantity = existedProductInCart.quantity + quantity;
         
         await CartModel.updateOne(
            {
               _id: cartId,
               "products.productId": productId
            },
            {
               $set: {
                  'products.$.quantity': totalQuantity
               }
            }
         );
      }
      else {
         await CartModel.updateOne(
            {
               _id: cartId,
            },
            {
               $push: {
                  products: {
                     productId: productId,
                     quantity: quantity
                  }
               }
            }
         );
      }
   
      // response.send("OK Frontend");
      request.flash("success", "Thêm vào giỏ hàng thành công!");
      response.redirect("back"); // go back to page [GET] /products/detail/:slug
   }
   catch(error) {
      request.flash("error", "ID không hợp lệ!");
      response.redirect(`/products`);
   }
}
// ----------------End []------------------- //


// ----------------[]------------------- //
// [GET] /cart/
module.exports.getCartPage = async (request, response) =>
{
   try {
      const cartId = request.cookies.cartId;
   
      const theCart = await CartModel.findOne(
         {
            _id: cartId // co tim den ID trong database, quang vo try catch
         }
      );

      theCart.totalPrice = 0; // add new key "totalPrice"

      if(theCart.products.length > 0) 
      {
         for(const product of theCart.products) {
            const productInfo = await ProductModel.findOne(
               {
                  _id: product.productId
               }
            ).select("title thumbnail slug price discountPercentage");


            // ----- Calculate and add new key "priceNew" ----- //
            productInfo.priceNew = (productInfo.price - (productInfo.price * productInfo.discountPercentage/100)).toFixed(0);
            // ----- End calculate and add new key "priceNew" ----- //


            // add new key "productInfo" into each product
            product.productInfo = productInfo;

            // add new key "totalPrice" into each product
            product.totalPrice = productInfo.priceNew * product.quantity;

            theCart.totalPrice = theCart.totalPrice + product.totalPrice;
         }
      }
   
      response.render(
         "client/pages/cart/index.pug", 
         {
            pageTitle: "Giỏ hàng",
            cartDetail: theCart
         }
      );
   }
   catch(error) {
      request.flash("error", "ID không hợp lệ!");
      response.redirect("/products");
   }
}

// [GET] /cart/delete/:productId
module.exports.deleteOutOfCart = async (request, response) => 
{
   try {
      const cartId = request.cookies.cartId;
      const productId = request.params.productId;
   
      await CartModel.updateOne(
         {
            _id: cartId,
         },
         {
            $pull: {
               products: {
                  productId: productId
               }
            }
         }
      );
   
      response.redirect("back"); // go back to page [GET] /cart
   }
   catch(error) {
      request.flash("error", "ID không hợp lệ!");
      response.redirect("/products");
   }
}
// ----------------End []------------------- /