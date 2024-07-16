const express = require("express");
const path = require("path");
const connectDB = require("./config/dbconnection"); //DB fx 
const app = express();
const cors = require("cors");
require("dotenv").config({ path: path.resolve(__dirname, ".env")});

const userRouter = require('./routes/userRoute')
const adminRouter = require('./routes/adminRoute')

const PORT = 5075 || process.env.PORT;
//middlewares usage

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", userRouter) //Middleware for user routes
app.use("/api/admin", adminRouter) //Middleware for admin routes


//database connection fx calling
connectDB();

app.listen(PORT, () => {
    console.log("Server Test Farm is running on the PORT No -", PORT);
});

app.get("/", (req, res) => {
    res.send("Welcome to backend of MCQ Test Farm");
});


