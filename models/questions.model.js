const mongoose = require("mongoose")

const addQuestionSchema = mongoose.Schema({
    questionname: {type: String, require: true},
    correctans: {type: String, require: true},
    options: {type: Object, require: true},
    exam: {type: mongoose.Schema.Types.ObjectId, ref: "exams"} //Builded relationship with exams schema. Joining required ref to be present in both the schema in a vice-versa order
},
    {timeStamps: true}
)

const questionsModel = mongoose.model('questions', addQuestionSchema)
module.exports = questionsModel