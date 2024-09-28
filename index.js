const express = require('express');

const routeClient = require("./routes/client/index.route.js"); // nhúng file index.route.js vao trong day

const app = express();  // khoi tao ung dung web su dung express
const port = 3000;

app.set("views", "./views"); // folder nao cung duoc, vd: app.set("views", "./abc")
app.set("view engine", "pug");

routeClient.index(app); // goi den ham index cua file index.route.js



app.listen(port, () => {
   console.log(`Đang chạy cổng ${port}`);
});