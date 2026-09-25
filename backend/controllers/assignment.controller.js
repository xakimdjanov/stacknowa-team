const { Assignment, Group, Submission, User, Evaluation } = require("../models");
const Joi = require("joi");

const assignmentSchema = Joi.object({
  group_id: Joi.number().integer().required(),
  title: Joi.string().required(),
  description: Joi.string().allow(null, ""),
  template_file_url: Joi.string().allow(null, ""),
  start_date: Joi.date().allow(null, ""),
  deadline: Joi.date().required(),
  max_score: Joi.number().integer().default(100),
  allow_resubmission: Joi.boolean().default(true),
  template_structure: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      title: Joi.string().required(),
      type: Joi.string().valid("rich_text", "code", "image").default("rich_text"),
      required: Joi.boolean().default(true),
    })
  ).default([
    { id: "theme", title: "1. Mavzu va Maqsad", type: "rich_text", required: true },
    { id: "theory", title: "2. Nazariy qism", type: "rich_text", required: true },
    { id: "practical", title: "3. Amaliy qism (Bajargan ishlar)", type: "rich_text", required: true },
    { id: "code", title: "4. Kod fragmenti", type: "code", required: false },
    { id: "conclusion", title: "5. Xulosa va Natija", type: "rich_text", required: true },
  ]),
  rubric: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      max_score: Joi.number().integer().required(),
    })
  ).default([
    { name: "Mavzu va kirish", max_score: 15 },
    { name: "Nazariy tushunchalar", max_score: 25 },
    { name: "Amaliyot va hisob-kitoblar", max_score: 40 },
    { name: "Xulosa va asoslash", max_score: 20 },
  ]),
});

/**
 * 1. Topshiriq yaratish (O'qituvchi)
 */
exports.createAssignment = async (req, res) => {
  try {
    const { error, value } = assignmentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const group = await Group.findByPk(value.group_id);
    if (!group) return res.status(404).json({ success: false, message: "Guruh topilmadi" });

    if (group.teacher_id !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Faqat guruh o'qituvchisi topshiriq yarata oladi" });
    }

    const assignment = await Assignment.create(value);

    return res.status(201).json({
      success: true,
      message: "Topshiriq muvaffaqiyatli yaratildi",
      assignment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 2. Guruh topshiriqlari
 */
exports.getGroupAssignments = async (req, res) => {
  try {
    const { groupId } = req.params;
    const assignments = await Assignment.findAll({
      where: { group_id: groupId },
      include: [
        {
          model: Submission,
          as: "submissions",
          attributes: ["id", "student_id", "status"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({ success: true, assignments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 3. Topshiriq tafsilotlari (Student Digital White Paper ochganda kerak bo'ladi)
 */
exports.getAssignmentDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findByPk(id, {
      include: [
        {
          model: Group,
          as: "group",
          include: [{ model: User, as: "teacher", attributes: ["id", "name", "email"] }],
        },
      ],
    });

    if (!assignment) return res.status(404).json({ success: false, message: "Topshiriq topilmadi" });

    // Agar so'rov yuborgan talaba bo'lsa, o'zining avvalgi submissionini ham olib beramiz
    let mySubmission = null;
    if (req.user && req.user.role === "STUDENT") {
      mySubmission = await Submission.findOne({
        where: { assignment_id: assignment.id, student_id: req.user.id },
        include: [{ model: Evaluation, as: "evaluation" }],
      });
    }

    return res.status(200).json({
      success: true,
      assignment,
      my_submission: mySubmission,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 4. Barcha topshiriqlarni olish (Admin uchun)
 */
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.findAll({
      include: [
        {
          model: Group,
          as: "group",
          include: [{ model: User, as: "teacher", attributes: ["id", "name", "email"] }],
        },
        {
          model: Submission,
          as: "submissions",
          attributes: ["id", "student_id", "status"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({ success: true, assignments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 5. Topshiriqni tahrirlash (Admin va O'qituvchi)
 */
exports.updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findByPk(id, {
      include: [{ model: Group, as: "group" }],
    });

    if (!assignment) {
      return res.status(404).json({ success: false, message: "Topshiriq topilmadi" });
    }

    if (req.user.role !== "ADMIN" && assignment.group?.teacher_id !== req.user.id) {
      return res.status(403).json({ success: false, message: "Ushbu topshiriqni tahrirlashga ruxsat yo'q" });
    }

    await assignment.update(req.body);

    return res.status(200).json({
      success: true,
      message: "Topshiriq muvaffaqiyatli yangilandi",
      assignment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 6. Topshiriqni o'chirish (Admin va O'qituvchi)
 */
exports.deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findByPk(id, {
      include: [{ model: Group, as: "group" }],
    });

    if (!assignment) {
      return res.status(404).json({ success: false, message: "Topshiriq topilmadi" });
    }

    if (req.user.role !== "ADMIN" && assignment.group?.teacher_id !== req.user.id) {
      return res.status(403).json({ success: false, message: "Ushbu topshiriqni o'chirishga ruxsat yo'q" });
    }

    await assignment.destroy();

    return res.status(200).json({
      success: true,
      message: "Topshiriq muvaffaqiyatli o'chirildi",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
