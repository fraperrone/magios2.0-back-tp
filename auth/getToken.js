import jwt from 'jsonwebtoken'

export const getToken = (req, res) => {
  const { user, pass } = req.body
  const { JWT_SECRET, ADMIN_USER, ADMIN_PASSWORD } = process.env

  if (!JWT_SECRET || !ADMIN_USER || !ADMIN_PASSWORD) {
    return res.status(500).render('login', {
      error: 'La configuración de autenticación está incompleta',
    })
  }

  if (user === ADMIN_USER && pass === ADMIN_PASSWORD) {
    const token = jwt.sign({ user }, JWT_SECRET, {
      expiresIn: '1h',
    })

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
    })

    return res.redirect('/home')
  }
  res.render('login', { error: 'Credenciales incorrectas' })
}
