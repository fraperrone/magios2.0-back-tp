import jwt from 'jsonwebtoken'

export const getToken = (req, res) => {
  const user = req.body?.user ? String(req.body.user).trim() : ''
  const pass = req.body?.pass ? String(req.body.pass).trim() : ''
  const { JWT_SECRET, ADMIN_USER, ADMIN_PASSWORD } = process.env

  if (!JWT_SECRET || !ADMIN_USER || !ADMIN_PASSWORD) {
    return res.status(500).render('login', {
      error: 'La configuración de autenticación está incompleta en el servidor',
    })
  }

  if (user === ADMIN_USER && pass === ADMIN_PASSWORD) {
    const token = jwt.sign({ user }, JWT_SECRET, {
      expiresIn: '24h',
    })

    // Configuración para funcionar dentro de iframes (SameSite=None, Secure=true)
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 86400000,
    })

    // Si la petición es API JSON
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.status(200).json({ mensaje: 'Login exitoso', token })
    }

    // Redirigir a /home pasando el token como parámetro para garantizar acceso
    // incluso si el navegador tiene políticas estrictas de cookies de terceros en el iframe
    return res.redirect(`/home?token=${token}`)
  }

  res.render('login', { error: 'Credenciales incorrectas (verifique usuario y contraseña)' })
}
