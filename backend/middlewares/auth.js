const jwt = require("jsonwebtoken");
const { User } = require("../models");

exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Avtorizatsiyadan o'tilmagan (Token topilmadi)" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "super_secret_jwt_key_hackathon_2026_practice_ai");

    const user = await User.findByPk(decoded.id);
    if (!user || !user.is_active) {
      return res.status(401).json({ success: false, message: "Foydalanuvchi faol emas yoki topilmadi" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Yaroqsiz yoki muddati o'tgan token", error: error.message });
  }
};

exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Avtorizatsiya talab qilinadi" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Ushbu amalni bajarish uchun ruxsat yo'q. Kerakli rol: ${allowedRoles.join(", ")}`,
      });
    }
    next();
  };
};
