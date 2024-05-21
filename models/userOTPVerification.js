const mongoose = require('mongoose')


const Schema = mongoose.Schema

const userOTPVerificaionSchema = new Schema({
   userId: String,
   otp: String,
   createdAt:Date,
   expiredAt: Date,
})

const userOTPVerificaion=mongoose.model(
    "userOTPVerification",
    userOTPVerificaionSchema
)

module.exports = userOTPVerificaion;

