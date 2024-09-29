const express = require('express');
require("dotenv").config();

const database = require("./config/database.js");
database.connectDatabase();

const routeClient = require("./routes/client/index.route.js"); // nhúng file index.route.js vao trong day

const app = express();  // khoi tao ung dung web su dung express
// const port = 3000;
const port = process.env.PORT;

app.set("views", "./views"); // doi voi response.render(), mac dinh di vao folder views
app.set("view engine", "pug");

app.use(express.static("public")); // nhung cac file tinh, tuc la folder public, mac dinh tu di vao folder public

routeClient.index(app); // goi den ham index cua file index.route.js



app.listen(port, () => {
   console.log(`Đang chạy cổng ${port}`);
});