


const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

main().catch(err => console.log(err));
require('dotenv').config;
async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}

const User = new Schema({
    avatar: {
        type: String,
        required:true
    },
    name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required:true
    }
    
})

User.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",User)

