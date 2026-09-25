const { User, Group, Submission, Plan } = require("../models");
const Joi = require("joi");
const bcrypt = require("bcryptjs");

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  role: Joi.string().valid("ADMIN", "TEACHER", "STUDENT"),
  plan_type: Joi.string().valid("FREE", "PRO"),
  is_active: Joi.boolean(),
  password: Joi.string().min(6).allow(null, ""),
});

/**
 * 1. Barcha foydalanuvchilar ro'yxati (Search va Filter bilan)
 */
exports.getAllUsers = async (req, res) => {
  try {
    const { role, plan_type, search } = req.query;
    const where = {};

    if (role) where.role = role;
    if (plan_type) where.plan_type = plan_type;

    const users = await User.findAll({
      where,
      attributes: { exclude: ["password"] },
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 2. Yangi foydalanuvchi yaratish (Admin tomonidan)
 */
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, plan_type } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Ism, email va parol kiritilishi shart" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: "Bu email bilan foydalanuvchi allaqachon mavjud" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "STUDENT",
      plan_type: plan_type || "FREE",
    });

    const userObj = user.toJSON();
    delete userObj.password;

    return res.status(201).json({
      success: true,
      message: "Foydalanuvchi yaratildi",
      user: userObj,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 3. Foydalanuvchini tahrirlash (Edit User)
 */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = updateUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Foydalanuvchi topilmadi" });
    }

    if (value.password && value.password.trim() !== "") {
      user.password = value.password; // Model beforeSave da hash qilinadi
    }
    delete value.password;

    Object.assign(user, value);
    await user.save();

    const userObj = user.toJSON();
    delete userObj.password;

    return res.status(200).json({
      success: true,
      message: "Foydalanuvchi yangilandi",
      user: userObj,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 4. Foydalanuvchini o'chirish (Delete User)
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.id === Number(id)) {
      return res.status(400).json({ success: false, message: "O'z hisobingizni o'chira olmaysiz!" });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Foydalanuvchi topilmadi" });
    }

    await user.destroy();
    return res.status(200).json({ success: true, message: "Foydalanuvchi muvaffaqiyatli o'chirildi" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
