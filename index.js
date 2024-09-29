const express = require('express');
require("dotenv").config();

const routeClient = require("./routes/client/index.route.js"); // nhúng file index.route.js vao trong day

const app = express();  // khoi tao ung dung web su dung express
// const port = 3000;
const port = process.env.PORT;

app.set("views", "./views"); // doi voi response.render(), mac dinh di vao folder views
app.set("view engine", "pug");

routeClient.index(app); // goi den ham index cua file index.route.js



app.listen(port, () => {
   console.log(`Đang chạy cổng ${port}`);
});