const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
   {
      fullName: String,
      email: String,
      phone: String,
      // link Facebook: ...
      password: String,
      token: String,
      avatar: String, // only save image link, the image is uploaded on cloud
      role_id: String,
      status: String,
      deleted: {
         type: Boolean,
         default: false
      },
   },
   {
      timestamps: true // automatically insert field createAt, updateAt
   }
);

const AccountModel = mongoose.model("Account", accountSchema, "accounts");

module.exports = AccountModel;