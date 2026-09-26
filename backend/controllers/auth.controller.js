const jwt = require("jsonwebtoken");
const { User, University } = require("../models");
const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("ADMIN", "UNIVERSITY_ADMIN", "TEACHER", "STUDENT").default("STUDENT"),
  university_code: Joi.string().allow("", null).optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const existingUser = await User.findOne({ where: { email: value.email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Bu email bilan allaqachon ro'yxatdan o'tilgan" });
    }

    let universityId = null;
    let approvalStatus = "APPROVED";

    if ((value.role === "TEACHER" || value.role === "STUDENT") && value.university_code) {
      const university = await University.findOne({ where: { unique_code: value.university_code, status: "ACTIVE" } });
      if (university) {
        universityId = university.id;
        if (value.role === "TEACHER") {
          approvalStatus = "PENDING"; // Teacher needs University Admin approval!
        }
      }
    }

    const user = await User.create({
      name: value.name,
      email: value.email,
      password: value.password,
      role: value.role,
      university_code: value.university_code,
      university_id: universityId,
      approval_status: approvalStatus,
    });

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || "super_secret_jwt_key_hackathon_2026_practice_ai",
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return res.status(201).json({
      success: true,
      message: approvalStatus === "PENDING"
        ? "Ro'yxatdan o'tildi! Ariyangiz universitet admini tasdig'iga yuborildi."
        : "Muvaffaqiyatli ro'yxatdan o'tildi",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        approval_status: user.approval_status,
        university_id: user.university_id,
        university_code: user.university_code,
        plan_type: user.plan_type,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const user = await User.findOne({ where: { email: value.email } });
    if (!user) {
      return res.status(400).json({ success: false, message: "Email yoki parol noto'g'ri" });
    }

    const isMatch = await user.comparePassword(value.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Email yoki parol noto'g'ri" });
    }

    let university_name = null;
    let university_plan = "ENTERPRISE";
    let university_obj = null;
    if (user.university_id) {
      const uni = await University.findByPk(user.university_id);
      if (uni) {
        university_name = uni.name;
        university_plan = uni.plan_name || "ENTERPRISE";
        university_obj = uni;
      }
    } else if (user.university_code) {
      const uni = await University.findOne({ where: { unique_code: user.university_code } });
      if (uni) {
        university_name = uni.name;
        university_plan = uni.plan_name || "ENTERPRISE";
        university_obj = uni;
      }
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || "super_secret_jwt_key_hackathon_2026_practice_ai",
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Tizimga muvaffaqiyatli kirildi",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        approval_status: user.approval_status,
        university_id: user.university_id,
        university_code: user.university_code,
        university_name,
        university_plan,
        university: university_obj,
        plan_type: university_obj?.plan_name || user.plan_type,
        plan_expires_at: user.plan_expires_at,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  let university_name = null;
  let university_plan = "ENTERPRISE";
  let university_obj = null;
  if (req.user?.university_id) {
    const uni = await University.findByPk(req.user.university_id);
    if (uni) {
      university_name = uni.name;
      university_plan = uni.plan_name || "ENTERPRISE";
      university_obj = uni;
    }
  } else if (req.user?.university_code) {
    const uni = await University.findOne({ where: { unique_code: req.user.university_code } });
    if (uni) {
      university_name = uni.name;
      university_plan = uni.plan_name || "ENTERPRISE";
      university_obj = uni;
    }
  }

  return res.status(200).json({
    success: true,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      approval_status: req.user.approval_status,
      university_id: req.user.university_id,
      university_code: req.user.university_code,
      university_name,
      university_plan,
      university: university_obj,
      plan_type: university_obj?.plan_name || req.user.plan_type,
      plan_expires_at: req.user.plan_expires_at,
    },
  });
};

exports.googleLogin = async (req, res) => {
  try {
    const { email, name, role = "STUDENT" } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email kiritilishi shart" });
    }

    let user = await User.findOne({ where: { email } });

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-10) + "Aa1!";
      user = await User.create({
        name: name || email.split("@")[0],
        email,
        password: randomPassword,
        role: role.toUpperCase(),
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || "super_secret_jwt_key_hackathon_2026_practice_ai",
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Google orqali tizimga muvaffaqiyatli kirildi",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        approval_status: user.approval_status,
        university_id: user.university_id,
        university_code: user.university_code,
        plan_type: user.plan_type,
        plan_expires_at: user.plan_expires_at,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
