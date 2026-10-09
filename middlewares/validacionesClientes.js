const validarDatos = (req, res, next) => {
  const { nombre, email, telefono } = req.body || {};

  if (!nombre || !email || !telefono) {
    return res.status(400).json({ message: 'nombre, email y telefono son obligatorios' });
  }

  //validamos emial
  if (!validarEmail(email)) {
    return res.status(400).json({ message: 'email no es válido' });
  }

  //validamos telefono
  if(!validarTelefono(telefono)) {
    return res.status(400).json({ message: 'telefono no es válido, debe tener 10 dígitos' });
  }

  next();
};

const validarEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validarTelefono = (telefono) => {
  const telefonoRegex = /^\d{10}$/;
  return telefonoRegex.test(telefono);
}


module.exports = { validarDatos };
