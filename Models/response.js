const mongoose = require("mongoose");
const Schema = mongoose.Schema;


main().catch(err => console.log(err));
require('dotenv').config;
async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}

const Response = new Schema({
    comment: {
        type: String,
        required:true
  },
  date: {
    type: Date,
    default: new Date(Date.now())
  },
    responsedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
    }
   
})

module.exports = mongoose.model("Response", Response);
