// [GET] /products/
module.exports.index = (request, response) => {
   response.render("client/pages/products/index.pug", {
      pageTitle: "Danh sách sản phẩm"
   });
}

// [POST] /products/create
// ...