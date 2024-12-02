const Order = require('../models/Order');
const Product = require('../models/Product');

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
                product_name: item.product?.name || "Producto no disponible",
                description: item.product?.description || "Sin descripción",
                price: item.product?.price ? parseFloat(item.product.price).toFixed(2) : "0.00", // Usar precio del producto actual
                quantity: item.quantity,
                subtotal: item.product?.price ? (item.quantity * parseFloat(item.product.price)).toFixed(2) : "0.00" // Calcular subtotal
            })),
            shipping_address: order.shipping_address || { street: "-", city: "-", state: "-", zip: "-" },
            billing_address: order.billing_address || { street: "-", city: "-", state: "-", zip: "-" },
            payment_status: order.payment?.status || "Sin información de pago"
        }));

        res.status(200).json(formattedOrders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener las órdenes del usuario." });
    }
};


const createOrder = async (req, res) => {
    try {
        const { items } = req.body;

        for (let item of items) {
            const product = await Product.findById(item.product);

            if (product.stock < item.quantity) {
                return res.status(400).send(`No hay suficiente stock para el producto: ${product.name}`);
            }
            product.stock -= item.quantity; //Se descuenta del stock

            await product.save(); //Guarda el producto
        }
        const order = new Order(req.body);
        await order.save();
        res.status(200).send(order);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).send("Error al procesar la orden.");
    }
};


module.exports = { getUserOrders, createOrder };
