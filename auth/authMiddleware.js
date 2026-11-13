import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token

  try {
    if (!token || !process.env.JWT_SECRET) {
      throw new Error('Token ausente o configuración incompleta')
    }

    jwt.verify(token, process.env.JWT_SECRET)
    return next()
  } catch {
    const path = req.originalUrl.split('?')[0]
    const isApiRoute = path === '/api' || path.startsWith('/api/')
    const isHtmlRoute = !isApiRoute
      && (path === '/home' || /\/vista(?:\/|$)/.test(path))

    if (isHtmlRoute) {
      return res.redirect('/')
    }

    return res.status(401).json({ error: 'No autenticado' })
  }
}
