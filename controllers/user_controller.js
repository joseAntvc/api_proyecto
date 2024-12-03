const  { User }  = require('../models/User');
const Address = require('../models/Address'); // Asegúrate de que la ruta sea correcta
const Payment = require('../models/Payment');

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
    // Verifica si el usuario existe
    const userExist = await User.findById(req.params.id);
    if (!userExist) {
      return res.status(404).json({ message: 'The user with the given ID was not found.' });
    }

    // Si el usuario desea actualizar su contraseña, encripta la nueva
    let updatedPassword = userExist.passwordHash; // Mantén la contraseña actual por defecto
    if (req.body.password && req.body.password.trim() !== '') {
      updatedPassword = bcrypt.hashSync(req.body.password, 10);
    }

    // Construye el objeto con los datos a actualizar
    const updatedData = {
      name: req.body.name || userExist.name, // Usa el valor actual si no se proporciona uno nuevo
      last_name: req.body.last_name || userExist.last_name,
      username: req.body.username || userExist.username,
      phone: req.body.phone || userExist.phone,
      email: req.body.email || userExist.email,
      password: updatedPassword, // Asegúrate de guardar el hash en el campo correcto
    };

    // Actualiza el usuario en la base de datos
    const user = await User.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!user) {
      return res.status(400).json({ message: 'The user cannot be updated!' });
    }

    // Responde con los datos actualizados
    res.status(200).json({
      message: 'User profile updated successfully.',
      user,
    });
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ message: 'An error occurred while updating the user.' });
  }
};


//Direcciones
const addDirections = async (req, res) => {
  try {
    const { userId } = req.params;
    const { country, city, postal_code, street } = req.body;

    console.log("userId recibido:", userId);
    console.log("Datos de la dirección recibidos:", { country, city, postal_code, street });

    // Crear la nueva dirección
    const address = new Address({ country, city, postal_code, street });
    await address.save();

    // Buscar al usuario y agregar el ID de la nueva dirección al campo 'addresses'
    const user = await User.findById(userId);
    if (!user) {
      console.error("Usuario no encontrado:", userId);
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Asociar la nueva dirección al usuario
    user.addresses.push(address._id);
    await user.save();

    res.status(200).json({ message: 'Dirección agregada y asociada al usuario', address, user });
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};

const getDirections = async (req, res) => {
  const { userId } = req.params; // Extraemos el userId de los parámetros de la ruta

  try {
    // Verificamos si el usuario existe y poblamos el campo 'addresses' con las direcciones asociadas
    const user = await User.findById(userId).populate("addresses"); // 'addresses' es el campo de referencias en el modelo User

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificamos si el usuario tiene direcciones asociadas
    if (!user.addresses.length) {
      return res.status(404).json({ message: "No se encontraron direcciones para este usuario" });
    }

    // Enviamos las direcciones como respuesta
    return res.status(200).json(user.addresses);
  } catch (error) {
    console.error("Error al obtener direcciones:", error);
    return res.status(500).json({ message: "Error al obtener las direcciones" });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    console.log("userId recibido:", userId);
    console.log("addressId recibido:", addressId);

    // Buscar al usuario para verificar si existe
    const user = await User.findById(userId);
    if (!user) {
      console.error("Usuario no encontrado:", userId);
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si el ID de la dirección existe en el array del usuario
    const addressIndex = user.addresses.indexOf(addressId);
    if (addressIndex === -1) {
      console.error("La dirección no está asociada a este usuario:", addressId);
      return res.status(404).json({ message: "La dirección no está asociada a este usuario" });
    }

    // Eliminar el ID de la dirección del array `addresses` del usuario
    user.addresses.splice(addressIndex, 1);
    await user.save();

    // Eliminar la dirección de la colección `Address`
    const deletedAddress = await Address.findByIdAndDelete(addressId);
    if (!deletedAddress) {
      console.error("Dirección no encontrada en la colección Address:", addressId);
      return res.status(404).json({ message: "Dirección no encontrada en la colección Address" });
    }

    res.status(200).json({
      message: "Dirección eliminada correctamente",
      user,
      deletedAddress,
    });
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
};


const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.send(payments);
} catch (err) {
    res.status(500).send('Error retrieving categories: ' + err.message);
}
};



module.exports = { getUserProfile, updateUserProfile, addDirections, getDirections, deleteAddress, getPayments };
