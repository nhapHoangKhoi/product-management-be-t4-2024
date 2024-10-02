const ProductModel = require("../models/product.model.js");

module.exports.paging = async (request, productFind) =>
{
   // { currentPage: 1, limitItems: 4, startIndex: 0, totalPage: 5 }
   const pagination = {
      currentPage: 1,
      limitItems: 4
   };

   if(request.query.page) {
      pagination.currentPage = parseInt(request.query.page);
   }

   pagination.startIndex = (pagination.currentPage - 1) * pagination.limitItems;

   const totalProductsCounted = await ProductModel.countDocuments(productFind);
   const totalPage = Math.ceil(totalProductsCounted / pagination.limitItems);
   pagination.totalPage = totalPage;

   return pagination;
}