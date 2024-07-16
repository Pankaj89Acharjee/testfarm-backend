const router = require('express').Router();
const User = require('../models/user.model');
const Exam = require('../models/createExam.model')
const Report = require('../models/examReport.model')
const Purchase = require('../models/purchaseExam.model')
const Carts = require('../models/cartHistory.model')
const verifyUserToken = require('../middlewares/isAuthUser')
const path = require("path");
const crypto = require("crypto")
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const Razorpay = require('razorpay')

//Instanciating Razorpay
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/registerNewUser", async (req, res) => {
    //console.log("API hitted from UI")
    // const userId = req.user.sub
    // console.log("User Id from middleware is", userId)
    const checkUser = await User?.findOne({ email: req.body.email })
    if (checkUser?.email) {
        return res.status(200).json({ statusCode: "0", message: "User already registerd", data: checkUser })
    }
    let payload = req.body
    try {
        const user = await User?.create({
            userId: payload.userId,
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            isAdmin: payload.isAdmin
        })
        if (user) {
            return res.status(200).json({ statusCode: "1", message: "New user registered" })
        }
    }
    catch (error) {
        console.log("Error in registering a new user", error)
        res.send({ statusCode: "0", error: "Error in registering a new user" });
    }
})



// router.post("/checkUserExists", verifyUserToken,  async (req, res) => {

//     // const userId = req.user.userId
//     // console.log("User Id from middleware is", userId)
//     try {        
//         const ifUserExists = await User.findOne({ email: req?.body?.email })

//         if (ifUserExists?.email) {
//             console.log("User found")
//             return res.status(200).json({ statusCode: "1", message: "User already exists", data: ifUserExists })
//         } else {
//             console.log("No user exists")
//             return res.status(200).json({ statusCode: "2", message: "No user exists" })
//         }
//     }
//     catch (error) {
//         console.log("Error in finding user", error)
//         res.send({ statusCode: "0", error: "Error in finding user" });
//     }
// })

router.get("/getAllExamDataForUser", verifyUserToken, async (req, res) => {
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


router.post("/getExamDataByIdForUser/:id", verifyUserToken, async (req, res) => {
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


router.post("/getAllQuestionsByExamId", verifyUserToken, async (req, res) => {
    try {
        const getQuestions = await Exam.findById(req.body.examId).populate("questions")  //.populate used to fetch data (viewing) where relationship has been made on a particular field
        //console.log("getallqs", getQuestions)
        res.status(200).json({ statusCode: 1, message: "Questions fetched", data: getQuestions })
    } catch (error) {
        console.log("Error in getting questions", error)
        res.status(200).json({
            statusCode: 0,
            message: error.message
        })
    }
})


router.post("/addNewQsAttemptReport", verifyUserToken, async (req, res) => {
    try {
        const saveNewReport = new Report(req.body)
        await saveNewReport.save()
        res.status(200).json({ statusCode: 1, message: "New exam attempt saved as record" })
    } catch (error) {
        console.log("Error in saving new exam attempt to report", error)
        res.status(200).json({ statusCode: 0, message: error.message })
    }
})



router.post("/getQuestionsAttemptByUser", verifyUserToken, async (req, res) => {
    try {
        const getReport = Report.find({
            user: req.body?.userId
        })
        if (getReport) {
            res.status(200).json({ statusCode: 1, message: "Exam report fetched successfully", data: getReport })
        } else {
            res.status(200).json({ statusCode: 0, message: "No record found" })
        }
    } catch (error) {
        console.log("Error in fetching exam report", error)
        res.status(200).json({ statusCode: 0, message: error.message })
    }
})


router.post("/generateOrder", async (req, res) => {
    const { cartData } = req.body
    console.log("Order data", cartData)

    const options = {
        amount: cartData.price * 100,
        currency: "INR"
    };
    instance.orders.create(options, function (err, success) {
        if (err) {
            console.log("Error", err)
        }
        console.log(success)
        res.status(200).json({ statusCode: 1, orderGeneratedetails: success })
    })
})

router.post("/verifyPayment", async (req, res) => {
    let body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id

    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET) //'crypto' an inbuilt package in nodejs
        .update(body.toString())
        .digest('hex')

    if (expectedSignature === req.body.response.razorpay_signature) {
        res.status(200).json({ statusCode: 1, message: "Signature is valid" })
    } else {
        res.status(500).json({ statusCode: 0, message: "Signature is in-valid" })
    }

})

//For saving the exam purchase record
router.post("/savePurchasingRecord", async (req, res) => {
    //console.log("REQ.BODY", req.body)
    try {
        const savePurchase = new Purchase(req.body)
        await savePurchase.save()

        //Inserting exam Id in the Exam collection
        const findAndSaveExamName = await Exam.findById(req.body.exams)
        if (findAndSaveExamName) {
            findAndSaveExamName?.purchase?.push(savePurchase._id)
            findAndSaveExamName.save()

            res.status(200).json({ statusCode: 1, message: "Purchase record saved successfully" })
        } else {
            res.status(200).json({ statusCode: 0, message: "No purchase record found" })
        }

    } catch (error) {
        console.log("Error in saving purchase record", error)
        res.status(200).json({ statusCode: 0, message: error.message })
    }

})


//Populating orders that an user made
router.post("/getAllOrders", verifyUserToken, async (req, res) => {
    try {
        let { userId } = req.body
        const getOrders = await Purchase.find({ users: userId }).populate("exams") //relationship between Purchase and Exam collections        
        res.status(200).json({ statusCode: 1, message: "Order details fetched successfully", data: getOrders })

    } catch (error) {
        console.log("Error in getting questions", error)
        res.status(200).json({
            statusCode: 0,
            message: error.message
        })
    }
})


router.post("/saveCartItems", async (req, res) => {
    try {
        for (const cartItem of req.body.cartItems) {
            const existingCartItem = await Carts.findOne({ productId: cartItem.productId })
            if (existingCartItem) {
                await Carts.updateOne({ productId: cartItem.productId }, cartItem)
            } else {
                const newCartItems = new Carts(cartItem)
                await newCartItems.save()
            }
        }
        res.status(200).json({ statusCode: 1, message: "Item updated in cart successfully" })
    } catch (error) {
        console.log("Error in saveCartItems", error.message)
        res.status(200).json({
            statusCode: 0,
            message: error.message
        })
    }
})

router.post("/retrieveCartItems",)


module.exports = router