const mongoose = require('mongoose')

const addExamSchema = new mongoose.Schema({
    examname: { type: String, required: true },
    duration: { type: Number, required: true },
    totalquestion: { type: Number, required: true },
    totalmarks: { type: Number, required: true },
    category: { type: String, required: true },
    cutoff: { type: Number, required: true },
    negativemarks: { type: Number, required: true },
    marksperquestion: { type: Number, required: true },
    price: { type: Number, required: true},
    validity: { type: Number, required: true, default: 365},
    questions: { type: [mongoose.Schema.Types.ObjectId], ref: 'questions', required: true }, //Object Id would hold an array of ojects, that is question ids. It is joining of two schemas.
    purchase: {type: [mongoose.Schema.Types.ObjectId], ref: 'purchase'} //Joining Purchase schema with this schema. Name of the schema should be matched exactly.
},
    { timestamps: true }
)

const examModel = mongoose.model('exams', addExamSchema);
module.exports = examModel