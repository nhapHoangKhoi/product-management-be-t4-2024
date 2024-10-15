const CartModel = require("../../models/cart.model");

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