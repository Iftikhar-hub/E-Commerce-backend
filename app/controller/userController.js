
const userModel = require('../models/eccommerce')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require("dotenv").config();

const userHome = (req, res) => {
    res.send("well Come")
}


const userRegistration = async (req, res) => {
    const { fname, email, pass, cpass } = req.body || {}; 
    
   
    try {
        if (!fname || !email || !pass || !cpass) {

            return res.status(400).json({ msg: "All fields required" });
        }
        if (pass !== cpass) {
            return res.status(400).json({
                status: 0,
                msg: "Password and Confirm Password should be match"
            });

        }
        let userEmail = await userModel.findOne({ email })
        if (userEmail) {
            return res.status(400).json({ msg: "This email already exist" })
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(pass,salt);

        const user = new userModel({
            name: fname,
            email:email,
            password: hashedPassword,
            
        });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2d' })
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30*24*60*60*1000

        })

        await user.save();
        res.json({ status: 200, msg: "Registration successful" });

    } catch (err) {
        res.status(500).json({
            status: 0,
            msg: "Failed to Register",
            error: err.message
        });
    }
};

const userLogin = async (req, res) => {
    const { email, password } = req.body || {};

    try {
        if (!email || !password) {
            return res.status(400).json({ msg: "Please Fill all the Fields"})
        }

        let user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).json({msg:"This email is not register, Please Register first"})     
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({msg:"Password Invalid"})
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2d' })
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000

        })

        res.status(200).json({ msg: "Login successful", user })
        user
    } catch (err) {
        console.error(err)
        res.status(500).json({
            status: 0,
            msg: "Failed to Register",
            error: err.message
        });
    }

    
}


module.exports = { userHome, userRegistration, userLogin };