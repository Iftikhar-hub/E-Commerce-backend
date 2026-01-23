

const productModel = require('../models/productModel')

require("dotenv").config();

const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const productInsertion = async (req, res) => {
    
    const { pname, description, orignalPrice, discountedPrice } = req.body || {};

    try {
        if (!pname || !description || !orignalPrice || !discountedPrice) {
           return res.status(400).json({msg:'All Details Require'})
        }

        const image = req.file.path
        if (!image) {
            return res.status(400).json({ msg: 'Product Image Missing' })
        }
        const cloudinaryProductResponse = await cloudinary.uploader.upload(image, {
            folder: 'ProductPicture'
        })
        console.log('Product Picture', cloudinaryProductResponse)

        const products = new productModel({
            pname,
            description,
            orignalPrice,
            discountedPrice,
            image: cloudinaryProductResponse.secure_url,


        });
        await products.save();
        res.json({ status: 200, msg: "Product Insertion successful" });
        
    } catch (err) {
        return res.status(400).json({ msg: 'Product went wrong', error: err.message });
        
    }

     
}

const productList = async (req, res) => {
    try {
        const pro = await productModel.find();
        res.status(200).json({
            msg: 'Product List',
            data: pro
            
        })
        
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    
    
};

module.exports = { productInsertion, productList };