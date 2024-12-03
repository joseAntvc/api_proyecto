const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const UserSales = require('../models/UserSales');

const getPedidosAnuales = async (req, res) => {
    try {
        const userId = req.params.Id;
        const year = new Date().getFullYear();

        const startOfYear = new Date(`${year}-01-01T00:00:00Z`);
        const endOfYear = new Date(`${year}-12-31T23:59:59Z`);

        const orders = await Order.find({
            user: userId,
            date: {
                $gte: startOfYear,
                $lte: endOfYear
            }
        }).populate('coupons', 'percentage');

        console.log(orders);
        const totalAmount = orders.length > 0
            ? orders.reduce((sum, order) => {
                const amount = parseFloat(order.total_amount.toString());
                const discount = order.coupons ? order.coupons.percentage : 0;
                return sum + (amount * ((100 - discount) / 100));
            }, 0)
            : 0;
        const totalOrders = orders.length > 0 ? orders.length : 0;

        res.json({
            totalAmount,
            totalOrders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getVentasAnuales = async (req, res) => {
    try {
        const userId = req.params.Id;
        const year = new Date().getFullYear();

        const startOfYear = new Date(`${year}-01-01T00:00:00Z`);
        const endOfYear = new Date(`${year}-12-31T23:59:59Z`);

        // Obtener los productos del usuario desde UserSales
        const userSales = await UserSales.find({ user: userId }).populate('products.product_id');

        // Si no tiene productos, devolver 0
        if (!userSales || userSales.length === 0) {
            return res.json({
                totalSales: 0,
                totalProducts: 0
            });
        }

        let totalSales = 0;
        let totalProducts = 0;

        // Recorrer cada entrada de UserSales
        for (const sale of userSales) {
            for (const product of sale.products) {
                const productId = product.product_id._id;

                // Buscar las órdenes del usuario que contienen este producto y están dentro del rango de fechas
                const orders = await Order.find({
                    date: { $gte: startOfYear, $lte: endOfYear },
                    "items.product_id": productId // Buscar solo si el producto está en la orden
                }).populate('items.product_id');

                let totalQuantity = 0;
                let totalProductSales = 0;

                // Calcular la cantidad total de productos y el total de ventas
                orders.forEach(order => {
                    order.items.forEach(item => {
                        if (item.product_id._id.toString() === productId.toString()) {
                            totalQuantity += item.quantity;
                            totalProductSales += parseFloat(item.product_id.price.toString()) * item.quantity;
                        }
                    });
                });

                // Sumar al total de productos y ventas
                totalProducts += totalQuantity;
                totalSales += totalProductSales;
            }
        }

        res.json({
            totalSales,    // Total de ventas en dinero
            totalProducts, // Cantidad total de productos vendidos
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const getSalesReport = async (req, res) => {
    try {
        const salesByYear = await Order.aggregate([
            {
                $addFields: {
                    date: { $dateFromString: { dateString: "$date", onError: null, onNull: null } }
                }
            },
            {
                $group: {
                    _id: { year: { $year: "$date" } },
                    total_sales: { $sum: "$total_amount" },
                    order_count: { $sum: 1 },
                    unique_customers: { $addToSet: "$customer_id" }, // Clientes únicos
                    products: { $push: "$products" } // Productos comprados
                }
            },
            {
                $project: {
                    year: "$_id.year",
                    total_sales: 1,
                    order_count: 1,
                    total_customers: { $size: "$unique_customers" },
                    products: { $reduce: { input: "$products", initialValue: [], in: { $setUnion: ["$$value", "$$this"] } } }
                }
            },
            { $sort: { year: 1 } }
        ]);

        const salesByMonth = await Order.aggregate([
            {
                $addFields: {
                    date: { $dateFromString: { dateString: "$date", onError: null, onNull: null } }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" }
                    },
                    total_sales: { $sum: "$total_amount" },
                    order_count: { $sum: 1 },
                    unique_customers: { $addToSet: "$customer_id" }, // Clientes únicos
                    products: { $push: "$products" } // Productos comprados
                }
            },
            {
                $project: {
                    year: "$_id.year",
                    month: "$_id.month",
                    total_sales: 1,
                    order_count: 1,
                    total_customers: { $size: "$unique_customers" },
                    products: { $reduce: { input: "$products", initialValue: [], in: { $setUnion: ["$$value", "$$this"] } } }
                }
            },
            { $sort: { year: 1, month: 1 } }
        ]);

        const salesByWeek = await Order.aggregate([
            {
                $addFields: {
                    date: { $dateFromString: { dateString: "$date", onError: null, onNull: null } }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        week: { $week: "$date" }
                    },
                    total_sales: { $sum: "$total_amount" },
                    order_count: { $sum: 1 },
                    unique_customers: { $addToSet: "$customer_id" }, // Clientes únicos
                    products: { $push: "$products" } // Productos comprados
                }
            },
            {
                $project: {
                    year: "$_id.year",
                    week: "$_id.week",
                    total_sales: 1,
                    order_count: 1,
                    total_customers: { $size: "$unique_customers" },
                    products: { $reduce: { input: "$products", initialValue: [], in: { $setUnion: ["$$value", "$$this"] } } }
                }
            },
            { $sort: { year: 1, week: 1 } }
        ]);

        res.json({
            salesByYear,
            salesByMonth,
            salesByWeek
        });

    } catch (error) {
        console.error("Error al obtener los datos:", error);
        res.status(500).json({ error: "Error al obtener el reporte de ventas" });
    }
};

module.exports = { getSalesReport, getPedidosAnuales, getVentasAnuales };