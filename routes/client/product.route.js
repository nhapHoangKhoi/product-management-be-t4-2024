const express = require("express");
const router = express.Router();

// giong nhu noi chuoi
router.get("/", (request, response) => {
   response.render("client/pages/products/index.pug");
});

module.exports = router;