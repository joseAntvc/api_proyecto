
const Category = require("../models/Category");
const Product = require('../models/Product');

const fetchAll = async (req, res) => {
    try {
        const categories = await Category.find();
        res.send(categories);
    } catch (err) {
        res.status(500).send('Error retrieving categories: ' + err.message);
    }
};

const countProducts = async (req, res) => {
    try {
        // Obtener el total de productos
        const total = await Product.countDocuments();

        // Obtener todas las categorías
        const categories = await Category.find();

        // Obtener el conteo de productos por categoría
        const categoryCounts = await Promise.all(
            categories.map(async (category) => {
                const productCount = await Product.countDocuments({ category: category._id });
                return {
                    _id: category._id,
                    name: category.name,
                    productCount
                };
            })
        );

        res.json({
            total,
            categories: categoryCounts
        });
    } catch (err) {
        res.status(500).send('Error retrieving categories: ' + err.message);
    }
};

module.exports = { fetchAll, countProducts }