// viet ham, cu phap ES6
// export const index = () => {...}
//
// viet ham, cu phap common JS
// de viet JS o trong NodeJS
module.exports.index = (app) =>
{
   app.get("/", (request, response) => {
      response.render("client/pages/home/index.pug");
   });
   
   app.get("/products", (request, response) => {
      response.render("client/pages/products/index.pug");
   });
}