const express = require('express');
const app = express();  // khoi tao ung dung web su dung express
const port = 3000;

app.set("views", "./views"); // folder nao cung duoc, vd: app.set("views", "./abc")
app.set("view engine", "pug");

app.get("/", (request, response) => {
   response.render("client/pages/home/index.pug");
});

app.get("/products", (request, response) => {
   response.render("client/pages/products/index.pug");
});



app.listen(port, () => {
   console.log(`Đang chạy cổng ${port}`);
});