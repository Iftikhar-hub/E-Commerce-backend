const Cart = require('../models/cartModel');

// Add or update item in cart
const addToCart = async (req, res) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) return res.status(400).json({ msg: "Product and quantity required" });

    try {
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            // Create new cart for user
            cart = new Cart({ user: userId, items: [{ productId, quantity }] });
        } else {
            // Check if product exists
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ productId, quantity });
            }
        }

        await cart.save();
        res.status(200).json({ msg: "Cart updated", cart });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error updating cart", error: err.message });
    }
};

// Get user cart
const getUserCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate("items.productId");
        res.status(200).json({ cart: cart || { items: [] } });
    } catch (err) {
        res.status(500).json({ msg: "Error fetching cart", error: err.message });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.body;

    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ msg: "Cart not found" });

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();

        res.status(200).json({ msg: "Item removed", cart });
    } catch (err) {
        res.status(500).json({ msg: "Error removing item", error: err.message });
    }
};

// Update quantity
const updateQuantity = async (req, res) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ msg: "Cart not found" });

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();
        res.status(200).json({ msg: "Quantity updated", cart });
    } catch (err) {
        res.status(500).json({ msg: "Error updating quantity", error: err.message });
    }
};

module.exports = { addToCart, getUserCart, removeFromCart, updateQuantity };
