  

const productModel = require('../models/productModel')


require("dotenv").config();

const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const productInsertion = async (req, res) => {
    
    const { pname, description, orignalPrice, discountedPrice, category } = req.body || {};

    try {
        if (!pname || !description || !orignalPrice || !discountedPrice || !category) {
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
            category 


        });
        await products.save();
        res.json({ status: 200, msg: "Product Insertion successful" });
        
    } catch (err) {
        return res.status(400).json({ msg: 'Product went wrong', error: err.message });
        
    }

     
}

const productList = async (req, res) => {
    try {
        const category = req.query.category; 
        let pro ;
        if (category) {
            pro = await productModel.find({ category });
        } else {
            pro = await productModel.find();
        }
        res.status(200).json({
            msg: 'Product List',
            data: pro
            
        })
        
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    
    
};




const productCheckout = async (req, res) => {
    const cartSitem = req.body;
    const { userEmail } = req.body;
    
    try {
        const MyDomain = process.env.NODE_ENV === "production"
            ? "https://e-commerce-nu-five-82.vercel.app"
            : "http://localhost:5173";
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: userEmail,
            line_items: cartSitem.cartItems.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.pname,
                        images: [item.image],

                    },
                    unit_amount: Math.round(item.discountedPrice * 100),

                },
                quantity: item.quantity,


            })),

            mode: 'payment',
            invoice_creation: {
                enabled: true
            },
            success_url: `${MyDomain}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${MyDomain}?canceled=true`,
        });


        console.log("carts are ", cartSitem.cartItems),
        res.json({ url: session.url });

    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Stripe checkout session failed' });
    }

    
}

const invoiceRetrieval =  async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(
            req.params.sessionId,
            { expand: ['invoice'] }
        );

        if (!session.invoice) {
            return res.status(404).json({ error: "Invoice not found" });
        }

        const invoice = await stripe.invoices.retrieve(session.invoice.id);

        res.json({
            invoice_url: invoice.invoice_pdf
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to get invoice" });
    }
}; 


const searchProducts = async (req, res) => {
    try {
        const { q } = req.query; 

        if (!q || q.trim() === "") {
            return res.status(400).json({ msg: "Search query cannot be empty" });
        }

        const filter = {
            $or: [
                { pname: { $regex: q, $options: "i" } },
                { description: { $regex: q, $options: "i" } },
                { category: { $regex: q, $options: "i" } },
            ],
        };

        const products = await productModel.find(filter);

        res.status(200).json({
            msg: `Search results for "${q}"`,
            data: products,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Search failed", error: err.message });
    }
};






   




module.exports = { productInsertion, productList, productCheckout, invoiceRetrieval, searchProducts };