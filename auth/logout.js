export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  // Si la solicitud proviene de un navegador web (HTML), redirige a la pantalla de login
  if (req.accepts('html') && !req.xhr && !req.originalUrl.startsWith('/api')) {
    return res.redirect('/');
  }

  // Si es un cliente de API REST (JSON)
  return res.status(200).json({ message: 'Sesión cerrada correctamente' });
};
