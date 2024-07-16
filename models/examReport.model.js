const mongoose = require('mongoose')

const examReportSchema = mongoose.Schema({
    user: { type: [mongoose.Schema.Types.ObjectId], ref: 'users' },
    examination: { type: [mongoose.Schema.Types.ObjectId], ref: 'exams' },
    result: { type: Object, required: true },
},
    { timestamps: true }
)

const examReportModel = mongoose.model('reports', examReportSchema)
module.exports = examReportModel