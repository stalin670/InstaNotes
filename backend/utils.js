import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: true, message: "Token not found" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) res.status(403).json({ error: true, message: "Invalid token" });

    req.user = user;
    next();
  });
}
