const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
            pname: String,
            image: String,
            discountedPrice: Number,
            orignalPrice: Number,
            quantity: Number
        }
    ],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
    paymentMethod: { type: String, enum: ['BANK', 'COD'], required: true },
    stripeSessionId: { type: String },  // optional: for Stripe payments
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
