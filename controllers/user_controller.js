const  { User }  = require('../models/User');

// Controlador para obtener el perfil de usuario por su ID
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    .populate("addresses")
    .populate('billings');

    if (!user) {
        return res.status(404).json({ message: 'The user with the given ID was not found.' });
    }

    res.status(200).send(user);
  } catch (error) {
      console.error('Error fetching user:', error.message);
      res.status(500).json({ message: 'An error occurred while fetching the user.' });
  }
};

// Controlador para actualizar el perfil de usuario
const updateUserProfile = async (req, res) => {
  try {
    const userExist = await User.findById(req.params.id);
    if (!userExist) {
        return res.status(404).json({ message: 'The user with the given ID was not found.' });
    }

    let newPassword = userExist.passwordHash;
    if (req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10);
    }

    const updatedData = {
        name: req.body.name,
        last_name: req.body.last_name,
        username: req.body.username,
        phone: req.body.phone,
        email: req.body.email,
        password: newPassword,
    };

    const user = await User.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!user) {
        return res.status(400).json({ message: 'The user cannot be updated!' });
    }

    res.status(200).send(user);
  } catch (error) {
      console.error('Error updating user:', error.message);
      res.status(500).json({ message: 'An error occurred while updating the user.' });
  }
};

module.exports = { getUserProfile, updateUserProfile };
