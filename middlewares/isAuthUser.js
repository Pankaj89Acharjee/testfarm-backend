const jwtDecode = require('jwt-decode')
const User = require('../models/user.model');


//Verify if the user is genuine through Bearer Token sent from UI
const verifyUserToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const decodeToken = jwtDecode(token)
    
    //console.log("Token from UI is", token)
    if (!token) {
        console.log("No token, unauthrozed")
        return res.status(401).json({ statusCode: "0", message: "Unauthorized" })
    }

    fetchUserData(decodeToken.sub)
        .then(function (data) {
            //console.log("Data fetched through token", data)
            if (!data) {
                console.log("No data found")
                //return res.status(200).json({ statusCode: "2", message: "No records found in Auth" }) 
            }           
            req.user = data;            
            next();
        })
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
module.exports = verifyUserToken