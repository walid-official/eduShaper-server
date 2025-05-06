// verifyToken.js
export const verifyToken = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).send({ message: "Unauthorized access" });
    }
    jwt.verify(token, process.env.ACCESS_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized access" });
      }
      req.user = decoded;
      next();
    });
  };
  
