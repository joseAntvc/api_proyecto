const Coupon = require("../models/Coupon");

const fecthFindCode = async (req, res) => {
    try {
        const coupo = await Coupon.findOne({ code: req.body.code });
        if (!coupo) {
            return res.status(404).send('Cupón no encontrado');
        }

        const dbExpiration = new Date(coupo.expiration);
        const requestExpiration = new Date(req.body.expiration);

        if (dbExpiration < requestExpiration) {
            return res.status(400).send('Cupón caducado.');
        } else {
            return res.status(200).json(coupo); // Respuesta exitosa
        }
    } catch (err) {
        return res.status(500).send('Error interno del servidor');
    }
};


module.exports = { fecthFindCode }