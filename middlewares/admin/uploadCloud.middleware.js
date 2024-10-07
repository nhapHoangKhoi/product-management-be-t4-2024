const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({ 
   cloud_name: process.env.CLOUD_NAME, 
   api_key: process.env.CLOUD_KEY, 
   api_secret: process.env.CLOUD_SECRET
});
 
module.exports.uploadSingleFile = (req, res, next) => 
{
   if(req.file) // neu co file up len thi cho len cloudinary
                // req.file chinh la cai file ma nguoi dung up len 
   {
      // this function is used to upload to cloudinary 
      const streamUpload = (buffer) => 
      {
         return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
               (error, result) => {
                  if (result) {
                     resolve(result);
                  } 
                  else {
                     reject(error);
                  }
               }
            );

            streamifier.createReadStream(buffer).pipe(stream);
         });
      }

      const uploadToCloudinary = async (buffer) => 
      {
         const result = await streamUpload(buffer);
         req.body[`${req.file.fieldname}`] = result.url; // bo sung them truong "thumbnail",...
                                                         // tùy theo tên người đặt
                                                         // req.body["thumbnail"]
                                                         // req.body["avatar"]
                                                         // ...
         next(); // next qua ham tiep theo o duoi
      }

      uploadToCloudinary(req.file.buffer);
      // res.send("ok");
   }
   else { // neu khong up file thi van cho next qua ham tiep theo o duoi nhu binh thuong
      next();
   }
}