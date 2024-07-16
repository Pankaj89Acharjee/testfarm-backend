const router = require('express').Router();
const Exam = require('../models/createExam.model');
const Questions = require('../models/questions.model')
const verifyAdminToken = require('../middlewares/isAdmin')

router.post("/addExam", verifyAdminToken, async (req, res) => {
    try {        
        const searchExam = await Exam.findOne({
            examname: req.body?.examname
        })
        if (searchExam) {
            res.status(200).json({ statusCode: 0, message: "Exam already exists" })
        }

        req.body.questions = [] //During first time creation  of exam, there will not be any questions, so []
        const saveData = new Exam(req.body)
        await saveData.save();
        res.status(200).json({
            statusCode: 1,
            message: "New exam created"
        })
    } catch (error) {
        console.log("Error in creating new exam", error)
        res.status(200).json({
            statusCode: 0,
            message: error.message
        })
    }
})

router.get("/getAllExamData", verifyAdminToken, async (req, res) => {
    try {
        const fetchData = await Exam.find()
        res.status(200).json({ statusCode: 1, message: "Exam data fetched", data: fetchData })
    } catch (error) {
        console.log("Error in fetching exam", error)
        res.status(200).json({
            statusCode: 0,
            message: error.message
        })
    }
})

router.post("/getExamDataById/:id", verifyAdminToken, async (req, res) => {
    try {
        const fetchData = await Exam.findById(req.params.id)
        res.status(200).json({ statusCode: 1, message: "Exam data by id found", data: fetchData })
    } catch (error) {
        console.log("Error in getting exam by Id", error)
        res.status(200).json({
            statusCode: 0,
            message: error.message
        })
    }
})


router.post("/editExamById/:id", verifyAdminToken, async (req, res) => {
    try {
        await Exam.findByIdAndUpdate(req.params.id, req.body)
        res.status(200).json({ statusCode: 1, message: "Exam data updated" })
    } catch (error) {
        console.log("Error in editing exam", error)
        res.status(200).json({
            statusCode: 0,
            message: error.message
        })
    }
})


router.post("/deleteExamById", verifyAdminToken, async (req, res) => {
    try {
        await Exam.findByIdAndDelete(req.body.id)
        res.status(200).json({ statusCode: 1, message: "Exam data deleted" })
    } catch (error) {
        console.log("Error in deleting exam", error)
        res.status(200).json({
            statusCode: 0,
            message: error.message
        })
    }
})


router.post("/addQuestions", verifyAdminToken, async (req, res) => {
    try {
        //Inserting in questions collection
        const createQs = new Questions(req.body)
        const saveQuestions = await createQs.save()

        //Inserting id of question in exam collection at the Questions field
        const findAndSaveExamName = await Exam.findById(req.body.exam) //Here exam is coming as id.

        await findAndSaveExamName?.questions?.push(saveQuestions._id)
        await findAndSaveExamName.save()
        res.status(200).json({ statusCode: 1, message: "New question has been created" })
    } catch (error) {
        console.log("Error in creating new question", error)
        res.status(200).json({
            statusCode: 0,
            message: error.message
        })
    }
})



router.post("/getAllQuestionsByExamId", verifyAdminToken, async (req, res) => {
    try {
        const getQuestions = await Exam.findById(req.body.examId).populate("questions")  //.populate used to fetch data (viewing) where relationship has been made on a particular field
        //console.log("getallqs", getQuestions)
        res.status(200).json({ statusCode: 1, message: "Questions fetched", data: getQuestions })
    } catch (error) {
        console.log("Error in creating new question", error)
        res.status(200).json({
            statusCode: 0,
            message: error.message
        })
    }
})


router.post("/editQuesByExamId", verifyAdminToken, async (req, res) => {
    try {
        await Questions.findByIdAndUpdate(req.body.questionId, req.body)
        res.status(200).json({ statusCode: 1, message: "Question updated successfully" })
    } catch (error) {
        console.log("Error in editing question", error)
        res.status(200).json({
            statusCode: 0,
            message: error.message
        })
    }
})


router.post("/deleteQuestionById", verifyAdminToken, async (req, res) => {
    try {
        //This will delete the question from the Questions document
        await Questions.findByIdAndDelete(req.body.questionId)

        //Also need to delete question Id from the Exam document where Questions is an array of question Ids
        const findQsInExam = await Exam.findById(req.body.examId)
        if (!findQsInExam) {
            return res.status(404).json({
                statusCode: 0,
                message: "Exam not found"
            });
        }
        await findQsInExam?.questions?.pull(req.body.questionId)
        await findQsInExam.save();
        res.status(200).json({ statusCode: 1, message: "Question deleted successfully" })
    } catch (error) {
        console.log("Error in deleting question", error)
        res.status(200).json({
            statusCode: 0,
            message: error.message
        })
    }
})

module.exports = router