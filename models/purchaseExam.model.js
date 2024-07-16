const mongoose = require('mongoose')

const purchaseExamSchema = mongoose.Schema({
    users: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    exams: { type: mongoose.Schema.Types.ObjectId, ref: 'exams' },
    orderid: { type: String, required: true },
    paymentid: { type: String, required: true },
    paysignature: { type: String, required: true }
},
    { timestamps: true }
)

const purchaseExamModel = mongoose.model('purchase', purchaseExamSchema)
module.exports = purchaseExamModel