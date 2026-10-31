import jwt from 'jsonwebtoken'
import { render } from 'pug'

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.token

  try {
    const validation = jwt.verify(token, 'secreta_1234')

    next()
  } catch (err) {
    res.status(401).json({ err })
  }
}
