const express = require('express');
require("dotenv").config();
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const database = require("./config/database.js");
database.connectDatabase();

const systemConfigs = require("./config/system.js");
const routeClient = require("./routes/client/index.route.js");
const routeAdmin = require("./routes/admin/index.route.js");

const app = express();  // khoi tao ung dung web su dung express
// const port = 3000;
const port = process.env.PORT;

// Flash
app.use(cookieParser('chuoigicungduoc'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// End flash

app.use(bodyParser.json()) // parse application/json

app.set("views", "./views"); // doi voi response.render(), mac dinh di vao folder views
app.set("view engine", "pug");

app.use(express.static("public")); // nhung cac file tinh, tuc la folder public, mac dinh tu di vao folder public


// app global variables for pug only
app.locals.prefixAdmin = systemConfigs.prefixAdmin;

routeClient.index(app); // goi den ham index cua file index.route.js
routeAdmin.index(app);


app.listen(port, () => {
   console.log(`Đang chạy cổng ${port}`);
});