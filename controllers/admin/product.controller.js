// [GET] /admin/products/
module.exports.index = async (request, response) => 
{
   response.render(
      "admin/pages/products/index.pug", 
      {
         pageTitle: "Quản lý sản phẩm",
      }
   );
}

// [POST] /admin/products/create
// ...