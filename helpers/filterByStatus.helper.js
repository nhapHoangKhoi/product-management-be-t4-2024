module.exports.filterByStatus = (request) =>
{
   const productFind = {
      deleted: false
   };

   // {status: "active"}
   // {status: "inactive"}
   // {status: undefined}
   if(request.query.status) {
      productFind.status = request.query.status;
   }

   return productFind;
}