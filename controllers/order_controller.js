const Order = require('../models/Order');

const getUserOrders = async (req, res) => {
    try {
        const userId = req.params.userId;

        const orders = await Order.find({ user: userId })
            .populate('items.product', 'name description price') 
            .populate('shipping_address', 'street city state zip')
            .populate('billing_address', 'street city state zip')
            .populate('payment', 'method status')
            .exec();

        if (!orders.length) {
            return res.status(404).json({ message: "No se encontraron órdenes para este usuario." });
        }

        const formattedOrders = orders.map(order => ({
            date: order.date,
            total_amount: order.total_amount,
            items: order.items.map(item => ({
                product_name: item.product.name,
                description: item.product.description,
                price: item.price.toString(),
                quantity: item.quantity
            })),
            shipping_address: order.shipping_address,
            billing_address: order.billing_address,
            payment_status: order.payment.status
        }));

        res.status(200).json(formattedOrders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener las órdenes del usuario." });
    }
};

module.exports = { getUserOrders };
