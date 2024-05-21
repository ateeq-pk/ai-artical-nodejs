const express = require('express');
const bcrypt = require('bcrypt');
const { User, sendOTPVerificationEmail } = require('../models/userModels');
const userOTPVerification = require('../models/userOTPVerification');

const router = express.Router();

const { signupUser, loginUser ,createToken} = require('../controllers/userController');

// Login routes
router.post('/login', loginUser);

// Signup routes
router.post('/signup', signupUser);

router.post('/verifyOTP', async (req, res) => {
    try {
        let { userId, otp } = req.body;
        if (!userId || !otp) {
            throw new Error("Empty OTP details are not allowed");
        }

        const UserOTPVerificationRecords = await userOTPVerification.find({ userId });

        if (UserOTPVerificationRecords.length <= 0) {
            throw new Error("Account record doesn't exist or has been verified already. Please sign up or log in.");
        } else {
            const { expiresAt } = UserOTPVerificationRecords[0];
            const hashedOTP = UserOTPVerificationRecords[0].otp;

            if (expiresAt < Date.now()) {
                await userOTPVerification.deleteMany({ userId });
                throw new Error("Code has expired. Please request again.");
            } else {
                const validOTP = await bcrypt.compare(otp, hashedOTP);

                if (!validOTP) {
                    throw new Error("Invalid code passed. Check your inbox.");
                } else {
                    // Update user's verified status
                    const updateResponse = await User.updateOne({ _id: userId }, { verified: true });

                    if (updateResponse.nModified === 0) {
                        throw new Error("Failed to verify user. Please try again.");
                    }

                    await userOTPVerification.deleteMany({ userId });

                    // Create a token (ensure createToken is defined)
                    const token = createToken(userId);

                    res.json({ statusbar: "VERIFIED", message: "User email verified successfully", token });
                }
            }
        }
    } catch (error) {
        res.json({
            statusbar: "FAILURE",
            message: error.message,
        });
    }
});

router.post('/resendOTPVerificationCode', async (req, res) => {
    try {
        let { userId, email } = req.body;
        if (!userId || !email) {
            throw new Error("Empty user details are not allowed");
        } else {
            await userOTPVerification.deleteMany({ userId });
            const otpResponse = await sendOTPVerificationEmail({ _id: userId, email });
            res.json(otpResponse);
        }
    } catch (error) {
        console.log(error);
        res.json({
            status: "FAILED",
            message: error.message,
        });
    }
});

module.exports = router;
