const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({path: path.resolve(__dirname, "../.env")});

//console.log("Connection Sring is", process.env.MONGODBURL)
const dbConnect = async() => {
    try {
        const connection = await mongoose.connect(process.env.MONGODBURL, {
            useNewUrlParser: true
        });
        if(connection) {
            console.log("Connection to MongoDB Established!");
        }
    } catch(error) {
        console.log("DB Connection Error", error.message);
    }
}

module.exports = dbConnect