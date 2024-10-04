const ProductModel = require("../models/product.model.js");

module.exports.paging = async (request, productFind, itemsLimited) =>
{
   // { currentPage: 1, itemsLimited: 4, startIndex: 0, totalPage: 5 }
   const pagination = {
      currentPage: 1,
      itemsLimited: itemsLimited
   };

   if(request.query.page) {
      pagination.currentPage = parseInt(request.query.page);
   }

   pagination.startIndex = (pagination.currentPage - 1) * pagination.itemsLimited;

   const totalProductsCounted = await ProductModel.countDocuments(productFind);
   const totalPage = Math.ceil(totalProductsCounted / pagination.itemsLimited);
   pagination.totalPage = totalPage;

   return pagination;
}