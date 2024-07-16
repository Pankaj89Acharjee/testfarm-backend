const jwtDecode = require('jwt-decode')
const User = require('../models/user.model');


//Verify if the user is genuine through Bearer Token sent from UI
const verifyAdminToken = async (req, res, next) => {
    try {
        const authHeader = req?.headers?.authorization;
       
        if (!authHeader) {
            console.log("No token, unauthrozed")
            return res.status(401).json({ statusCode: "0", message: "Unauthorized" })
        }

        if (authHeader === "Bearer null") {
            console.log("No token specified")
            return res.status(422).json({ statusCode: "0", message: "No token specified" })
        }

        if (authHeader) {
            const token = authHeader && authHeader?.split(' ')[1];
            const decodeToken = jwtDecode(token)
            fetchUserData(decodeToken.sub)
                .then(function (data) {
                   // console.log("Data fetched through token", data)
                    if (!data) {
                        console.log("Unauthorised admin access")
                        //return res.status(200).json({ statusCode: 0, message: "You are not Admin, hence you are unauthorised" }) 
                    }
                    req.admin = data;
                    next();
                })
        }

    } catch (error) {
        console.log("Error in isAdmin Middleware token authorization", error)
    }

}

const fetchUserData = async (id) => {
    try {
        const userDetails = await User.findOne({ userId: id })
        return userDetails
    } catch (error) {
        console.log('Error in fetchData function', error);
        return null
    }
}
module.exports = verifyAdminToken