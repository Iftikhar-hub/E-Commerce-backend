const Wishlist = require('../models/wishlistModel');

const addToWishlist = async (req, res) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity)
        return res.status(400).json({ msg: "Product and quantity required" });

    try {
        let wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
            wishlist = new Wishlist({ user: userId, items: [{ productId, quantity }] });
        } else {

            const itemIndex = wishlist.items.findIndex(
                item => item.productId.toString() === productId
            );
            if (itemIndex > -1) {
                wishlist.items[itemIndex].quantity += quantity;
            } else {
                wishlist.items.push({ productId, quantity });
            }
        }

        await wishlist.save();

        await wishlist.populate("items.productId");
        const addedItem = wishlist.items.find(
            item => item.productId._id.toString() === productId
        );

        res.status(200).json({
            msg: "Item added to wishlist",
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
        res.status(500).json({ msg: "Error updating wishlist", error: err.message });
    }
};

const getUserWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user._id }).populate("items.productId");
        res.status(200).json({ wishlist: wishlist || { items: [] } });
    } catch (err) {
        res.status(500).json({ msg: "Error fetching wishlist", error: err.message });
    }
};

const removeFromWishlist = async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.body;

    try {
        const wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) return res.status(404).json({ msg: "wishlist not found" });

        wishlist.items = wishlist.items.filter(item => item.productId.toString() !== productId);
        await wishlist.save();

        res.status(200).json({ msg: "Item removed", wishlist });
    } catch (err) {
        res.status(500).json({ msg: "Error removing item", error: err.message });
    }
};

const updateQuantityy = async (req, res) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    try {
        const wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) return res.status(404).json({ msg: "wishlist not found" });

        const itemIndex = wishlist.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex > -1) {
            wishlist.items[itemIndex].quantity = quantity;
        }

        await wishlist.save();
        res.status(200).json({ msg: "Wishlist updated", wishlist });
    } catch (err) {
        res.status(500).json({ msg: "Error updating quantity", error: err.message });
    }
};

module.exports = { addToWishlist, getUserWishlist, removeFromWishlist, updateQuantityy };
