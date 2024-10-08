// [GET] /admin/dashboard/
module.exports.index = (request, response) => {
   response.render(
      "admin/pages/dashboard/index.pug", 
      {
         pageTitle: "Trang dashboard"
      }
   );
}