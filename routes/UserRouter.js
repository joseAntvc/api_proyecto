const { User } = require('../models/User');
const user_controller = require("../controllers/user_controller");
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//var guard = require('express-jwt-permissions')()
/*var guard = require('express-jwt-permissions')({
    requestProperty: 'auth',
    //permissionsProperty: 'scope'
  })*/
//, guard.check('user:read')
router.get(`/`, async (req, res) => {
    const userList = await User.find().select('-passwordHash');

    if (!userList) {
        res.status(500).json({ success: false })
    }
    res.send(userList);
})

router.route('/profile/:id')
    .get(user_controller.getUserProfile)
    .put(user_controller.updateUserProfile);

router.route('/addresses/:userId')
    .get(user_controller.getDirections)
    .post(user_controller.addDirections);

router.post('/', async (req, res) => {
    let user = new User({
        name: req.body.name,
        last_name: req.body.last_name,
        username: req.body.username,
        phone: req.body.phone,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    })
    user = await user.save();

    if (!user)
        return res.status(400).send('The user cannot be created!')

    res.send(user);
})

router.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username })
    const secret = process.env.SECRET;
    if (!user) {
        return res.status(400).send('Usuario no encontrado.');
    }

    if (user && bcrypt.compareSync(req.body.password, user.password)) {
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: true,
            },
            secret,
            { expiresIn: '1d' }
        )

        res.status(200).send({ id: user.id, user: user.username, token: token })
    } else {
        res.status(400).send('Contraseña incorrecta!');
    }
})


router.post('/register', async (req, res) => {

    let errors = [];

    const existingEmail = await User.findOne({ email: req.body.email });
    const existingUser = await User.findOne({ username: req.body.username });

    if (existingEmail) errors.push('El correo electrónico ya está registrado.');
    if (existingUser) errors.push('El usuario ya está registrado.');

    if (errors.length > 0) return res.status(400).json({ errors });
    
    let user = new User({
        name: req.body.name,
        last_name: req.body.last_name,
        username: req.body.username,
        phone: req.body.phone,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    })
    user = await user.save();

    if (!user) return res.status(400).send('El usuario no se pudo crear!')

    const secret = process.env.SECRET;
    const token = jwt.sign(
        {
            userId: user.id,
            isAdmin: true,
        },
        secret,
        { expiresIn: '1d' }
    )
    res.status(200).send({ id: user.id, user: user.username, token: token })
})


router.delete('/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id).then(user => {
        if (user) {
            return res.status(200).json({ success: true, message: 'the user is deleted!' })
        } else {
            return res.status(404).json({ success: false, message: "user not found!" })
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err })
    })
})

router.get(`/get/count`, async (req, res) => {
    const userCount = await User.countDocuments((count) => count)

    if (!userCount) {
        res.status(500).json({ success: false })
    }
    res.send({
        userCount: userCount
    });
})


module.exports = router;