
const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require("dotenv").config();

const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
 


const userHome = (req, res) => {
    res.send("well Come")
}


const userRegistration = async (req, res) => {
    const { fname, email, pass, cpass } = req.body || {}; 
   

    try {
        if (!fname || !email || !pass || !cpass ) {

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
        const hashedPassword = await bcrypt.hash(pass, salt);
        
        // const file = req.file.path
        //    const cloudinaryResponse = await cloudinary.uploader.upload(file, {
        //        folder:'UserPicture'
        //    })
        //    console.log('User Picture', cloudinaryResponse)

        const user = new userModel({
            name: fname,
            email: email,
           
            password: hashedPassword,
            
        });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2d' })
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
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

const userUpdate = async (req, res) => {
    const { name, email, address, phone, currentPassword, newPassword, confirmNewPassword } = req.body;

    try {
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.address = address || user.address;
        user.phone = phone || user.phone;

        if (currentPassword || newPassword || confirmNewPassword) {
            if (!currentPassword) {
                return res.status(400).json({ msg: "Enter current password" });
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: "Current password is incorrect" });
            }

            if (!newPassword || !confirmNewPassword) {
                return res.status(400).json({ msg: "Enter new password" });
            }

            if (newPassword !== confirmNewPassword) {
                return res.status(400).json({ msg: "Passwords do not match" });
            }

            const salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(newPassword, salt);
        }

        await user.save();
        return res.status(200).json({ msg: "Profile Updated Successfully" });

    } catch (err) {
        return res.status(500).json({
            msg: "Failed to update",
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
            secure: true,
            sameSite: "none",
            maxAge: 30 * 24 * 60 * 60 * 1000

        })

        res.status(200).json({ msg: "Login successful", user })
        user
    } catch (err) {
        console.error(err)
        res.status(500).json({
            status: 0,
            msg: "Failed to Login",
            error: err.message
        });
    }

    
}

const userLogout = (req, res) => {
    res.cookie('token', '',{
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires : new Date(0)
    })

    res.status(200).json({msg:'Logout Successful'})
    
} 

const userProfile = (req, res) => {
    res.status(200).json({
        msg: 'User Profile',
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        file: req.user.file,
    
    })
    
    
}





module.exports = { userHome, userRegistration, userLogin, userLogout, userProfile, userUpdate };