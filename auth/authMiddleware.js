import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
  const token =
    req.cookies?.token ||
    req.headers?.authorization?.replace(/^Bearer\s+/i, "") ||
    req.query?.token;

  try {
    if (!token || !process.env.JWT_SECRET) {
      throw new Error("Token ausente o configuración incompleta");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Si el token vino por query param, intentar reasegurar la cookie para las siguientes peticiones
    if (req.query?.token && !req.cookies?.token) {
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 86400000,
      });
    }

    res.locals.currentToken = token;
    res.locals.user = decoded.user;

    return next();
  } catch {
    const path = req.originalUrl.split("?")[0];
    const isApiRoute = path === "/api" || path.startsWith("/api/");
    const isHtmlRoute =
      !isApiRoute && (path === "/home" || /\/vista(?:\/|$)/.test(path));

    if (isHtmlRoute) {
      return res.redirect("/");
    }

    return res.status(401).json({ error: "No autenticado" });
  }
};
