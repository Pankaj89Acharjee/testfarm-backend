const mongoose = require('mongoose')

const cartItems = mongoose.Schema({
    users: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
},
    { timestamps: true }
)

const cartItemsModel = mongoose.model('cartmodel', cartItems)
module.exports = cartItemsModel