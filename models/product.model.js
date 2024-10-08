const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
   {
      title: String,
      product_category_id: String,
      description: String,
      price: Number,
      discountPercentage: Number,
      stock: Number,
      thumbnail: String,
      status: String,
      position: Number,
      deleted: {
         type: Boolean,
         default: false
      },
      slug: {
         type: String,
         slug: "title", // tu dong render slug theo truong title
         unique: true
      }
   },
   {
      timestamps: true // automatically insert field createAt, updateAt
   }
);

const ProductModel = mongoose.model("Product", productSchema, "products");

module.exports = ProductModel;