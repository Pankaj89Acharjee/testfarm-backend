const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: {type: String, unique: true},
    name: { type: String, required: [true, 'Name required'] },
    email: { type: String, required: [true, 'Email must be unique'], unique: true },
    phone: { type: String, required: true, unique: true }, 
    isAdmin: {type: Boolean, required: true, default: false},  //default: false, as not all users are admins    
},

    { timestamps: true }
);

const userModel = mongoose.model("users", userSchema);
module.exports = userModel

