const { Group, GroupMember, User, Assignment, Submission } = require("../models");
const { nanoid } = require("nanoid");
const QRCode = require("qrcode");
const Joi = require("joi");

const groupSchema = Joi.object({
  name: Joi.string().required(),
  subject: Joi.string().required(),
  course: Joi.number().integer().min(1).max(7).required(),
  faculty: Joi.string().allow(null, ""),
  academic_year: Joi.string().required(), // e.g. "2025-2026"
  semester: Joi.number().integer().valid(1, 2).required(),
  access_code: Joi.string().allow(null, ""),
  allowed_email_domain: Joi.string().allow(null, ""),
});

/**
 * 1. Guruh yaratish (Faqat O'qituvchi yoki Admin)
 */
exports.createGroup = async (req, res) => {
  try {
    const { error, value } = groupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    // Teacher Free limit tekshiruvi
    if (req.user.role === "TEACHER" && req.user.plan_type === "FREE") {
      const count = await Group.count({ where: { teacher_id: req.user.id } });
      if (count >= 3) {
        return res.status(403).json({
          success: false,
          message: "Free tarifda ko'pi bilan 3 ta guruh ochishingiz mumkin. Pro tarifiga o'ting.",
        });
      }
    }

    const joinToken = nanoid(12);
    const group = await Group.create({
      ...value,
      join_token: joinToken,
      teacher_id: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Guruh muvaffaqiyatli yaratildi",
      group,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 2. O'qituvchining o'z guruhlari ro'yxati (yoki Admin uchun barcha guruhlar)
 */
exports.getMyGroups = async (req, res) => {
  try {
    const where = req.user.role === "ADMIN" ? {} : { teacher_id: req.user.id };
    const groups = await Group.findAll({
      where,
      include: [
        { model: User, as: "teacher", attributes: ["id", "name", "email"] },
        { model: GroupMember, as: "members" },
        { model: Assignment, as: "assignments" },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({ success: true, groups });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 3. Talaba a'zo bo'lgan guruhlar ro'yxati
 */
exports.getStudentGroups = async (req, res) => {
  try {
    const memberships = await GroupMember.findAll({
      where: { student_id: req.user.id },
      include: [
        {
          model: Group,
          as: "group",
          include: [
            { model: User, as: "teacher", attributes: ["id", "name", "email"] },
            { model: Assignment, as: "assignments" },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    const groups = memberships.map((m) => m.group);
    return res.status(200).json({ success: true, groups });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 4. Guruh tafsilotlari (Guruh a'zolari, topshiriqlar, QR-kod)
 */
exports.getGroupDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findByPk(id, {
      include: [
        { model: User, as: "teacher", attributes: ["id", "name", "email"] },
        {
          model: GroupMember,
          as: "members",
          include: [{ model: User, as: "student", attributes: ["id", "name", "email"] }],
        },
        { model: Assignment, as: "assignments" },
      ],
    });

    if (!group) {
      return res.status(404).json({ success: false, message: "Guruh topilmadi" });
    }

    // QR-kod generatsiya qilish
    const joinUrl = `${req.protocol}://${req.get("host")}/join/${group.join_token}`;
    const qrCodeDataUrl = await QRCode.toDataURL(joinUrl);

    return res.status(200).json({
      success: true,
      group,
      join_token: group.join_token,
      join_url: joinUrl,
      qr_code: qrCodeDataUrl,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 5. Student Join Link orqali qo'shilishi (TOKEN + ACCESS_CODE)
 */
exports.joinGroup = async (req, res) => {
  try {
    const { token } = req.params;
    const { access_code } = req.body;

    const group = await Group.findOne({ where: { join_token: token, status: "active" } });
    if (!group) {
      return res.status(404).json({ success: false, message: "Havola eskirgan yoki guruh topilmadi" });
    }

    // Email domen cheklovi bo'lsa tekshirish
    if (group.allowed_email_domain) {
      if (!req.user.email.endsWith(`@${group.allowed_email_domain}`)) {
        return res.status(403).json({
          success: false,
          message: `Faqat @${group.allowed_email_domain} domeni orqali qo'shilish mumkin`,
        });
      }
    }

    // Agar o'qituvchi guruhga kirish paroli (access_code) o'rnatgan bo'lsa
    if (group.access_code && group.access_code.trim() !== "") {
      if (group.access_code !== access_code) {
        return res.status(400).json({
          success: false,
          message: "Guruhga kirish paroli (access_code) noto'g'ri",
        });
      }
    }

    // Allaqachon a'zo bo'lganmi?
    const existing = await GroupMember.findOne({
      where: { group_id: group.id, student_id: req.user.id },
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Siz allaqachon ushbu guruh a'zosisiz",
        group_id: group.id,
      });
    }

    await GroupMember.create({
      group_id: group.id,
      student_id: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Guruhga muvaffaqiyatli qo'shildingiz!",
      group_id: group.id,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 6. Linkni yangilash / qayta generatsiya qilish
 */
exports.regenerateJoinLink = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findByPk(id);

    if (!group) return res.status(404).json({ success: false, message: "Guruh topilmadi" });
    if (group.teacher_id !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Ruxsat yo'q" });
    }

    group.join_token = nanoid(12);
    await group.save();

    return res.status(200).json({
      success: true,
      message: "Guruh havolasi yangilandi",
      join_token: group.join_token,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
