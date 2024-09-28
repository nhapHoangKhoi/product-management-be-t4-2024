const express = require('express');
const app = express();  // khoi tao ung dung web su dung express
const port = 3000;

app.get("/", (request, response) => {
   response.send("Trang chủ");
});

app.get("/products", (request, response) => {
   response.send("Trang danh sách sản phẩm");
});



app.listen(port, () => {
   console.log(`Đang chạy cổng ${port}`);
});