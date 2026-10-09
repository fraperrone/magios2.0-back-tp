const handleErrors = (err, req, res, next) => {
  console.error(err.stack);

  // si el error tiene mensaje y status, lo usamos, si no, usamos 500
  const status = err.status || 500;
  const message = err.message || "Error interno del servidor";

  res.status(status).json({ error: message });
};

module.exports = handleErrors;
