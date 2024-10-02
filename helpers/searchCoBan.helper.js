module.exports.search = (request, productFind) =>
{
   let keyword = "";
   let objectReturn = "";
   
   if(request.query.inputKeyword) 
   {
      const regex = new RegExp(request.query.inputKeyword, "i");
      productFind.title = regex;

      keyword = request.query.inputKeyword;

      objectReturn = {
         productFindTitle: productFind.title,
         keyword: keyword
      };
   }

   return objectReturn;
}