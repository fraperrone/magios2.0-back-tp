import jwt from 'jsonwebtoken'
import cokierParser from 'cookie-parser'

export const getToken = (req, res) => {
  const { user, pass } = req.body
  if (user == 'admin' && pass == '1234') {
    const token = jwt.sign({ user: user }, 'secreta_1234', {
      expiresIn: '1h',
    })

    res.cookie('token', token, {
      maxAge: 3600000,
    })

    return res.redirect('/home')
  }
  res.render("login", {error: "crdenciales incorrectas"})
}
