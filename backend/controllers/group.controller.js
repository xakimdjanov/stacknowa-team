const { Group, GroupMember, Attendance, User, University, Assignment, Submission, Event } = require("../models");
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
        {
          model: GroupMember,
          as: "members",
          include: [{ model: User, as: "student", attributes: ["id", "name", "email"] }],
        },
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
            {
              model: GroupMember,
              as: "members",
              include: [{ model: User, as: "student", attributes: ["id", "name", "email"] }],
            },
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
    const { access_code } = req.body || {};

    const group = await Group.findOne({ 
      where: { join_token: token, status: "active" },
      include: [{ model: User, as: "teacher", attributes: ["id", "university_id"] }]
    });

    if (!group) {
      return res.status(404).json({ success: false, message: "Havola eskirgan yoki guruh topilmadi" });
    }

    // Faqat talabalar guruhga a'zo bo'lishi mumkin!
    if (req.user.role && req.user.role !== "STUDENT") {
      return res.status(403).json({
        success: false,
        message: "Faqat talabalar guruhga a'zo bo'lishi mumkin! O'qituvchi yoki Admin guruhga talaba sifatida qo'shila olmaydi.",
      });
    }

    // Email domen cheklovi bo'lsa tekshirish
    if (group.allowed_email_domain && group.allowed_email_domain.trim() !== "") {
      if (!req.user.email.endsWith(`@${group.allowed_email_domain}`)) {
        return res.status(403).json({
          success: false,
          message: `Faqat @${group.allowed_email_domain} domeni orqali qo'shilish mumkin`,
        });
      }
    }

    // Agar o'qituvchi guruhga kirish paroli (access_code) o'rnatgan bo'lsa
    if (group.access_code && group.access_code.trim() !== "") {
      if (!access_code || group.access_code.trim() !== access_code.trim()) {
        return res.status(400).json({
          success: false,
          requires_access_code: true,
          message: !access_code ? "Ushbu guruhga kirish uchun parol kiritishingiz kerak" : "Guruhga kirish paroli (access_code) noto'g'ri",
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

    // Talaba guruhga qo'shilganda: agar guruh o'qituvchisi universitetga tegishli bo'lsa,
    // talaba ham ushbu universitetga biriktiriladi va universitetning faol obuna tarifini (masalan, STANDART) meros qilib oladi!
    if (group.teacher?.university_id) {
      const uni = await University.findByPk(group.teacher.university_id);
      if (uni) {
        await User.update(
          {
            university_id: uni.id,
            university_code: uni.unique_code,
            plan_type: uni.plan_name || "STANDART",
          },
          { where: { id: req.user.id } }
        );
      }
    }

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

/**
 * 7. O'qituvchi yoki Admin guruhga talabani bevosita qo'shishi
 */
exports.addStudentToGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Talaba emaili kiritilishi shart" });
    }

    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({ success: false, message: "Guruh topilmadi" });
    }

    let student = await User.findOne({ where: { email } });
    if (!student) {
      const randomPass = Math.random().toString(36).slice(-8) + "Aa1!";
      student = await User.create({
        name: name || email.split("@")[0],
        email,
        password: randomPass,
        role: "STUDENT",
        approval_status: "APPROVED",
      });
    }

    const [member, created] = await GroupMember.findOrCreate({
      where: { group_id: group.id, student_id: student.id },
      defaults: { group_id: group.id, student_id: student.id },
    });

    if (group.teacher_id) {
      const teacher = await User.findByPk(group.teacher_id);
      if (teacher?.university_id) {
        const uni = await University.findByPk(teacher.university_id);
        if (uni) {
          student.university_id = uni.id;
          student.university_code = uni.unique_code;
          student.plan_type = uni.plan_name || "STANDART";
          await student.save();
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: created ? "Talaba guruhga qo'shildi! ✅" : "Talaba allaqachon guruhda bor",
      member,
      student: { id: student.id, name: student.name, email: student.email },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 8. Guruhni tahrirlash (Teacher yoki Admin)
 */
exports.updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({ success: false, message: "Guruh topilmadi" });
    }
    if (req.user.role !== "ADMIN" && group.teacher_id !== req.user.id) {
      return res.status(403).json({ success: false, message: "Ruxsat berilmagan" });
    }

    const { name, subject, course, faculty, academic_year, semester, access_code, allowed_email_domain, status } = req.body;
    
    if (name) group.name = name;
    if (subject) group.subject = subject;
    if (course !== undefined) group.course = Number(course);
    if (faculty !== undefined) group.faculty = faculty;
    if (academic_year) group.academic_year = academic_year;
    if (semester !== undefined) group.semester = Number(semester);
    if (access_code !== undefined) group.access_code = access_code;
    if (allowed_email_domain !== undefined) group.allowed_email_domain = allowed_email_domain;
    if (status) group.status = status;

    await group.save();

    return res.status(200).json({
      success: true,
      message: "Guruh ma'lumotlari muvaffaqiyatli yangilandi",
      group,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 9. Guruhni o'chirish (Teacher yoki Admin)
 */
exports.deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({ success: false, message: "Guruh topilmadi" });
    }
    if (req.user.role !== "ADMIN" && group.teacher_id !== req.user.id) {
      return res.status(403).json({ success: false, message: "Ruxsat berilmagan" });
    }

    // A'zolarni tozalash va bog'liq eventlarni uzish
    await GroupMember.destroy({ where: { group_id: id } });
    if (Event) {
      await Event.update({ group_id: null }, { where: { group_id: id } });
    }
    await group.destroy();

    return res.status(200).json({
      success: true,
      message: "Guruh muvaffaqiyatli o'chirildi",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 10. Guruh davomati (Attendance) ni olish
 */
exports.getGroupAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    const group = await Group.findByPk(id);
    if (!group) return res.status(404).json({ success: false, message: "Guruh topilmadi" });

    const whereCondition = { group_id: id };
    if (date) {
      whereCondition.date = date;
    }

    const records = await Attendance.findAll({
      where: whereCondition,
      include: [{ model: User, as: "student", attributes: ["id", "name", "email"] }],
      order: [["date", "DESC"]],
    });

    // Barcha sanalarni olish
    const allRecords = await Attendance.findAll({
      where: { group_id: id },
      attributes: ["student_id", "status", "date"],
    });

    // Talabalar bo'yicha davomat statistikasi
    const statsByStudent = {};
    const totalDates = new Set();

    allRecords.forEach((rec) => {
      totalDates.add(rec.date);
      if (!statsByStudent[rec.student_id]) {
        statsByStudent[rec.student_id] = { present: 0, absent: 0, late: 0, excused: 0, total: 0 };
      }
      statsByStudent[rec.student_id].total += 1;
      const statusKey = (rec.status || "PRESENT").toLowerCase();
      if (statsByStudent[rec.student_id][statusKey] !== undefined) {
        statsByStudent[rec.student_id][statusKey] += 1;
      }
    });

    return res.status(200).json({
      success: true,
      date: date || null,
      total_days: totalDates.size,
      records,
      statsByStudent,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 11. Guruh davomatini saqlash / yangilash (Batch update)
 */
exports.saveGroupAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, records } = req.body;

    if (!date || !Array.isArray(records)) {
      return res.status(400).json({ success: false, message: "Sana va talabalar davomat ro'yxati berilishi shart" });
    }

    const group = await Group.findByPk(id);
    if (!group) return res.status(404).json({ success: false, message: "Guruh topilmadi" });

    // Sanalar va har bir talaba uchun davomatni yozish
    const upsertPromises = records.map((rec) => {
      return Attendance.upsert({
        group_id: Number(id),
        student_id: rec.student_id,
        date: date,
        status: rec.status || "PRESENT",
        note: rec.note || null,
      });
    });

    await Promise.all(upsertPromises);

    const updatedRecords = await Attendance.findAll({
      where: { group_id: id, date },
      include: [{ model: User, as: "student", attributes: ["id", "name", "email"] }],
    });

    return res.status(200).json({
      success: true,
      message: `${date} sana uchun davomat muvaffaqiyatli saqlandi! ✅`,
      records: updatedRecords,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 12. Guruhdan talabani o'chirish (Remove student from group)
 */
exports.removeStudentFromGroup = async (req, res) => {
  try {
    const { id, studentId } = req.params;

    const member = await GroupMember.findOne({ where: { group_id: id, student_id: studentId } });
    if (!member) {
      return res.status(404).json({ success: false, message: "Talaba ushbu guruhda topilmadi" });
    }

    await member.destroy();

    return res.status(200).json({
      success: true,
      message: "Talaba guruhdan muvaffaqiyatli chiqarildi",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


