const { User, University, Group, Submission, Plan } = require("../models");
const Joi = require("joi");
const bcrypt = require("bcryptjs");

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  role: Joi.string().valid("ADMIN", "UNIVERSITY_ADMIN", "TEACHER", "STUDENT"),
  plan_type: Joi.string().allow("FREE", "STARTER", "STANDART", "ENTERPRISE", "PRO"),
  is_active: Joi.boolean(),
  password: Joi.string().min(6).allow(null, ""),
});

/**
 * Universitet Unique Code bilan bog'lanish va arizani PENDING holatiga o'tkazish
 */
exports.linkUniversityCode = async (req, res) => {
  try {
    const { university_code } = req.body;
    const userId = req.user?.id;

    if (!university_code) {
      return res.status(400).json({ success: false, message: "Universitet unique kodi kiritilishi shart" });
    }

    const university = await University.findOne({ where: { unique_code: university_code, status: "ACTIVE" } });
    if (!university) {
      return res.status(404).json({ success: false, message: "Ushbu unique kodga ega universitet topilmadi!" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Foydalanuvchi topilmadi" });
    }

    user.university_code = university_code;
    user.university_id = university.id;
    // Also inherit university plan
    if (university.plan_name) {
      user.plan_type = university.plan_name;
    }
    user.approval_status = "PENDING"; // Approval pending by University Admin
    await user.save();

    const userObj = user.toJSON();
    delete userObj.password;

    return res.status(200).json({
      success: true,
      message: `Arizangiz ${university.name} Adminiga yuborildi! (Kutilmoqda)`,
      user: userObj,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

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
      include: [
        {
          model: University,
          as: "university",
          attributes: ["id", "name", "plan_name", "unique_code"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    const formattedUsers = users.map((u) => {
      const userJson = u.toJSON();
      // Agar foydalanuvchi universitetga tegishli bo'lsa va universitet tarif sotib olgan bo'lsa,
      // uning tarifi universitet tarifini meros qilib oladi!
      if (userJson.university?.plan_name) {
        userJson.plan_type = userJson.university.plan_name;
        userJson.is_university_covered = true;
      }
      return userJson;
    });

    return res.status(200).json({ success: true, users: formattedUsers });
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
      user.password = value.password;
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
