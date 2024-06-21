
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require('dotenv').config;

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}


const Post = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    club: {
        type: String,
        required: true
    },
    upVote: [],
    downVote: [],
    date: {
        type: Date,
        default: new Date(Date.now())
    },
    bestRes: {
        type: Schema.Types.ObjectId,
        ref: "Response",
    },
    status: {
        type: String,
        default: "Open",
    },
    views: [],
    likes:[],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    response: [{
        type: Schema.Types.ObjectId,
        ref: "Response"
    }]

})


module.exports = mongoose.model("Post", Post)

