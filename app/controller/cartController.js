const Cart = require('../models/cartModel');

const addToCart = async (req, res) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity)
        return res.status(400).json({ msg: "Product and quantity required" });

    try {
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [{ productId, quantity }] });
        } else {

            const itemIndex = cart.items.findIndex(
                item => item.productId.toString() === productId
            );
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ productId, quantity });
            }
        }

        await cart.save();

        await cart.populate("items.productId");
        const addedItem = cart.items.find(
            item => item.productId._id.toString() === productId
        );

        res.status(200).json({
            msg: "Item added to cart",
            item: {
                _id: addedItem.productId._id,
                pname: addedItem.productId.pname,
                image: addedItem.productId.image,
                discountedPrice: addedItem.productId.discountedPrice,
                orignalPrice: addedItem.productId.orignalPrice,
                quantity: addedItem.quantity
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error updating cart", error: err.message });
    }
};

const getUserCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate("items.productId");
        res.status(200).json({ cart: cart || { items: [] } });
    } catch (err) {
        res.status(500).json({ msg: "Error fetching cart", error: err.message });
    }
};

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
