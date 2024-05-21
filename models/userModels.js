require('dotenv').config();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const validator = require('validator');
const userOTPVerification = require('./../models/userOTPVerification');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean
    }
});

// Create a transporter object
let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
    secure: true,
  });


const sendOTPVerificationEmail = async ({ _id, email }) => {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: email,
            subject: "Verify your Email",
            html: `<p>Enter <b>${otp}</b> on the website to verify your email address.</p><p>This OTP expires in one hour.</p>`
        };

        const salt = await bcrypt.genSalt(10);
        const hashOTP = await bcrypt.hash(otp, salt);

        const newOTPVerification = new userOTPVerification({
            userId: _id,
            otp: hashOTP,
            createdAt: Date.now(),
            expiredAt: Date.now() + 3600000
        });

        await newOTPVerification.save();
        await transporter.sendMail(mailOptions);

        return {
            status: "PENDING",
            message: "Verification OTP email sent",
            data: {
                userId: _id,
                email
            }
        };

    } catch (error) {
        throw new Error(error.message);
    }
};

// Static signup method
userSchema.statics.signup = async function(email, password) {
    // Validation
    if (!email || !password) {
        throw new Error("All fields must be filled");
    }
    if (!validator.isEmail(email)) {
        throw new Error('Email is not valid');
    }
    if (!validator.isStrongPassword(password)) {
        throw new Error('Weak Password');
    }

    const exists = await this.findOne({ email });

    if (exists) {
        throw new Error("Email already in use");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({ email, password: hash, verified: false });
    
    const otpResponse = await sendOTPVerificationEmail(user);

    return { user, otpResponse };
};

// Static login method
userSchema.statics.login = async function(email, password) {
    if (!email || !password) {
        throw new Error("All fields must be filled");
    }

    const user = await this.findOne({ email });

    if (!user) {
        throw new Error("Incorrect Email");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw new Error('Incorrect Password');
    }

    if(user.verified!=true){
        throw new Error('User Not verified');
    }

    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = { User, sendOTPVerificationEmail };
