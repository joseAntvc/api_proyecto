const Order = require('../models/Order');

const getUserOrders = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Obtener órdenes y popular solo lo necesario
        const orders = await Order.find({ user: userId })
            .populate('items.product', 'name description price') // Obtener solo nombre, descripción y precio
            .populate('shipping_address', 'street city state zip')
            .populate('billing_address', 'street city state zip')
            .populate('payment', 'method status')
            .exec();

        if (!orders.length) {
            return res.status(404).json({ message: "No se encontraron órdenes para este usuario." });
        }

        // Formatear las órdenes
        const formattedOrders = orders.map(order => ({
            date: order.date,
            total_amount: order.items.reduce((sum, item) => sum + item.quantity * parseFloat(item.product.price), 0), // Calcular total
            items: order.items.map(item => ({
                product_name: item.product.name,
                description: item.product.description,
                price: parseFloat(item.product.price).toFixed(2), // Usar precio del producto actual
                quantity: item.quantity,
                subtotal: (item.quantity * parseFloat(item.product.price)).toFixed(2) // Calcular subtotal
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
