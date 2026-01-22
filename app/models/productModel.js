const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    pname: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        
    },
    orignalPrice: {
        type: String,
        required: true,
        
    },
    discountedPrice: {
        type: String,
        required: true,
        
    },
    image: {
        type: String,
        required: true,
    }
   

});
module.exports = mongoose.model("product", productSchema);



