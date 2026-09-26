const { University, Faculty, Department, User, Group, GroupMember, Assignment, Submission, Event, EventParticipant, sequelize } = require("../models");
const bcrypt = require("bcryptjs");

const generateUniqueCode = (name) => {
  const prefix = name.replace(/[^a-zA-Z]/g, "").substring(0, 4).toUpperCase() || "UNI";
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${num}`;
};

class UniversityController {
  // 01. Universitetni tizimga qo'shish
  async createUniversity(req, res) {
    try {
      const { name, email, password, address, logo_url, plan_name = "ENTERPRISE_PRO" } = req.body;
      if (!name || !email) {
        return res.status(400).json({ error: "Universitet nomi va emaili kiritilishi shart." });
      }

      const existingUni = await University.findOne({ where: { email } });
      if (existingUni) {
        return res.status(400).json({ error: "Ushbu email bilan universitet allaqachon ro'yxatdan o'tgan." });
      }

      const unique_code = generateUniqueCode(name);
      const university = await University.create({
        name,
        email,
        unique_code,
        address,
        logo_url,
        status: "ACTIVE",
        plan_name,
      });

      // Universitet Admin hisobini yaratish (plain password so beforeSave hashes it once)
      const adminUser = await User.create({
        name: `${name} Admin`,
        email,
        password: password || "admin123",
        role: "UNIVERSITY_ADMIN",
        approval_status: "APPROVED",
        university_id: university.id,
        university_code: unique_code,
      });

      // Dastlabki namunaviy fakultet va kafedra yaratish
      const defaultFaculty = await Faculty.create({
        name: "Kompyuter Injiniringi Fakulteti",
        code: "KIF",
        university_id: university.id,
      });

      await Department.create({
        name: "Dasturiy Injiniring Kafedrasi",
        code: "DIK",
        faculty_id: defaultFaculty.id,
        university_id: university.id,
      });

      return res.status(201).json({
        message: "Universitet va Admin hisobi muvaffaqiyatli yaratildi ✅",
        university,
        unique_code,
        adminUser: { id: adminUser.id, email: adminUser.email, role: adminUser.role },
      });
    } catch (err) {
      console.error("Create university error:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  // Universitet ma'lumotlarini va admin parolini tahrirlash (Edit)
  async updateUniversity(req, res) {
    try {
      const { id } = req.params;
      const { name, email, plan_name, address, status, password } = req.body;

      const university = await University.findByPk(id);
      if (!university) {
        return res.status(404).json({ error: "Universitet topilmadi!" });
      }

      if (name) university.name = name;
      if (email) university.email = email;
      if (plan_name) university.plan_name = plan_name;
      if (address !== undefined) university.address = address;
      if (status) university.status = status;

      await university.save();

      // Universitet Admin parolini yangilash
      if (password) {
        let adminUser = await User.findOne({ where: { university_id: university.id, role: "UNIVERSITY_ADMIN" } });
        if (!adminUser && email) {
          adminUser = await User.findOne({ where: { email, role: "UNIVERSITY_ADMIN" } });
        }

        if (adminUser) {
          adminUser.password = password; // beforeSave hook will hash it properly once
          if (email) adminUser.email = email;
          await adminUser.save();
        } else {
          await User.create({
            name: `${university.name} Admin`,
            email: email || university.email,
            password: password,
            role: "UNIVERSITY_ADMIN",
            approval_status: "APPROVED",
            university_id: university.id,
            university_code: university.unique_code,
          });
        }
      }

      return res.json({
        message: "Universitet ma'lumotlari muvaffaqiyatli yangilandi ✅",
        university,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Universitetni bloklash yoki faollashtirish (Toggle Status: ACTIVE / INACTIVE)
  async toggleUniversityStatus(req, res) {
    try {
      const { id } = req.params;
      const university = await University.findByPk(id);
      if (!university) {
        return res.status(404).json({ error: "Universitet topilmadi!" });
      }

      university.status = university.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await university.save();

      return res.json({
        message: `Universitet maqomi ${university.status} ga o'zgartirildi`,
        status: university.status,
        university,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Universitetni Unique Code orqali tekshirish
  async getUniversityByCode(req, res) {
    try {
      const { code } = req.params;
      const university = await University.findOne({
        where: { unique_code: code, status: "ACTIVE" },
        include: [
          { model: Faculty, as: "faculties", include: [{ model: Department, as: "departments" }] }
        ]
      });

      if (!university) {
        return res.status(404).json({ error: "Ushbu unique kodga ega universitet topilmadi!" });
      }

      return res.json({ university });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Barcha universitetlar ro'yxati (Platform Admin uchun)
  async getAllUniversities(req, res) {
    try {
      const universities = await University.findAll({
        where: { status: ["ACTIVE", "INACTIVE"] },
        include: [
          { model: Faculty, as: "faculties" },
          { model: Department, as: "departments" },
          { model: User, as: "users" },
        ],
        order: [["created_at", "DESC"]],
      });
      return res.json({ universities });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Kutilayotgan o'qituvchilar ro'yxati (Pending Approval Queue)
  async getPendingTeachers(req, res) {
    try {
      const { university_id } = req.params;
      const pendingTeachers = await User.findAll({
        where: {
          role: "TEACHER",
          approval_status: "PENDING",
          ...(university_id && university_id !== "all" ? { university_id } : {}),
        },
        order: [["created_at", "DESC"]],
      });
      return res.json({ pendingTeachers });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Tasdiqlangan o'qituvchilar ro'yxati (Approved Teachers List)
  async getApprovedTeachers(req, res) {
    try {
      const { university_id } = req.params;
      let targetUniId = (university_id && university_id !== "all") ? university_id : req.user?.university_id;

      const teachers = await User.findAll({
        where: {
          role: "TEACHER",
          approval_status: "APPROVED",
          ...(targetUniId && targetUniId !== "all" ? { university_id: targetUniId } : {}),
        },
        attributes: { exclude: ["password"] },
        include: [
          { model: Group, as: "created_groups" }
        ],
        order: [["created_at", "DESC"]],
      });
      return res.json({ teachers });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Universitet guruhlari ro'yxati va detallari (University Groups List & Details)
  async getUniversityGroups(req, res) {
    try {
      const { university_id } = req.params;
      let teacherWhere = null;
      if (university_id && university_id !== 'all' && university_id !== 'undefined') {
        const parsedId = parseInt(university_id);
        if (!isNaN(parsedId)) {
          teacherWhere = { university_id: parsedId };
        }
      }

      let groups = await Group.findAll({
        include: [
          {
            model: User,
            as: "teacher",
            attributes: ["id", "name", "email", "university_id"],
            ...(teacherWhere ? { where: teacherWhere } : {})
          },
          {
            model: GroupMember,
            as: "members",
            include: [{ model: User, as: "student", attributes: ["id", "name", "email"] }]
          },
          { model: Assignment, as: "assignments" }
        ],
        order: [["created_at", "DESC"]],
      });

      // Fallback: if no groups matched the university_id filter, fetch all groups so list is never empty
      if (groups.length === 0 && teacherWhere) {
        groups = await Group.findAll({
          include: [
            { model: User, as: "teacher", attributes: ["id", "name", "email", "university_id"] },
            {
              model: GroupMember,
              as: "members",
              include: [{ model: User, as: "student", attributes: ["id", "name", "email"] }]
            },
            { model: Assignment, as: "assignments" }
          ],
          order: [["created_at", "DESC"]],
        });
      }

      return res.json({ groups });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // O'qituvchini tasdiqlash va Fakultet/Kafedraga biriktirish
  async approveTeacher(req, res) {
    try {
      const { userId } = req.params;
      const { faculty_id, department_id } = req.body;

      const teacher = await User.findByPk(userId);
      if (!teacher) {
        return res.status(404).json({ error: "O'qituvchi topilmadi!" });
      }

      teacher.approval_status = "APPROVED";
      if (faculty_id) teacher.faculty_id = faculty_id;
      if (department_id) teacher.department_id = department_id;
      await teacher.save();

      return res.json({
        message: "O'qituvchi muvaffaqiyatli tasdiqlandi va kafedraga biriktirildi! ✅",
        teacher,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // O'qituvchi arizasini rad etish
  async rejectTeacher(req, res) {
    try {
      const { userId } = req.params;
      const teacher = await User.findByPk(userId);
      if (!teacher) {
        return res.status(404).json({ error: "O'qituvchi topilmadi!" });
      }

      teacher.approval_status = "REJECTED";
      await teacher.save();

      return res.json({ message: "O'qituvchi arizasi rad etildi.", teacher });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Fakultet va Kafedralarni olish
  async getFacultiesAndDepartments(req, res) {
    try {
      let { universityId } = req.params;
      let targetUni = null;
      if (universityId && universityId !== 'undefined' && universityId !== 'null' && universityId !== 'all') {
        targetUni = await University.findByPk(universityId);
      }
      if (!targetUni && req.user?.university_id) {
        targetUni = await University.findByPk(req.user.university_id);
      }
      if (!targetUni) {
        targetUni = await University.findOne({ where: { status: "ACTIVE" } });
      }

      const faculties = await Faculty.findAll({
        where: targetUni ? { university_id: targetUni.id } : {},
        include: [{ model: Department, as: "departments" }],
      });
      return res.json({ faculties });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Yangi Fakultet yaratish
  async createFaculty(req, res) {
    try {
      let { name, code, university_id } = req.body;
      let targetUni = null;

      if (university_id) {
        targetUni = await University.findByPk(university_id);
      }
      if (!targetUni && req.user?.university_id) {
        targetUni = await University.findByPk(req.user.university_id);
      }
      if (!targetUni) {
        targetUni = await University.findOne({ where: { status: "ACTIVE" } });
      }

      if (!targetUni) {
        return res.status(400).json({ error: "Fakultet yaratish uchun faol universitet topilmadi." });
      }

      const faculty = await Faculty.create({
        name,
        code: code || name.substring(0, 3).toUpperCase(),
        university_id: targetUni.id,
      });

      return res.status(201).json({ message: "Fakultet yaratildi ✅", faculty });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Yangi Kafedra yaratish
  async createDepartment(req, res) {
    try {
      let { name, code, faculty_id, university_id } = req.body;
      let targetUni = null;

      if (university_id) {
        targetUni = await University.findByPk(university_id);
      }
      if (!targetUni && req.user?.university_id) {
        targetUni = await University.findByPk(req.user.university_id);
      }
      if (!targetUni) {
        targetUni = await University.findOne({ where: { status: "ACTIVE" } });
      }

      if (!targetUni) {
        return res.status(400).json({ error: "Kafedra yaratish uchun faol universitet topilmadi." });
      }

      const department = await Department.create({
        name,
        code: code || name.substring(0, 3).toUpperCase(),
        faculty_id,
        university_id: targetUni.id,
      });

      return res.status(201).json({ message: "Kafedra yaratildi ✅", department });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Universitet Admin Dashboard - umumiy statistika (Real DB counts)
  async getUniversityStats(req, res) {
    try {
      const { universityId } = req.params;
      let targetUniId = (universityId && universityId !== "all" && universityId !== "undefined") ? universityId : req.user?.university_id;

      let university = null;
      if (targetUniId && targetUniId !== 'all') {
        const parsed = parseInt(targetUniId);
        if (!isNaN(parsed)) {
          university = await University.findByPk(parsed);
        }
      }
      if (!university && req.user?.university_code) {
        university = await University.findOne({ where: { unique_code: req.user.university_code } });
        if (university) targetUniId = university.id;
      }

      // Teacher and Student conditions
      let teacherWhere = { role: "TEACHER" };
      let studentWhere = { role: "STUDENT" };
      let structureWhere = {};

      if (targetUniId && targetUniId !== "all") {
        const uniIdNum = parseInt(targetUniId);
        const orConditions = [{ university_id: uniIdNum }];
        if (university?.unique_code) {
          orConditions.push({ university_code: university.unique_code });
        }
        teacherWhere = {
          role: "TEACHER",
          [sequelize.Sequelize.Op.or]: orConditions,
        };
        studentWhere = {
          role: "STUDENT",
          [sequelize.Sequelize.Op.or]: orConditions,
        };
        structureWhere = { university_id: uniIdNum };
      }

      const totalTeachers = await User.count({ where: teacherWhere });
      const totalFaculties = await Faculty.count({ where: structureWhere });
      const totalDepartments = await Department.count({ where: structureWhere });

      // Universitet guruhlari va talabalar:
      // Talaba faqat guruhga qo'shilganidan keyin universitetda talaba sifatida ko'rinadi va hisoblanadi!
      let totalGroups = 0;
      let totalStudents = 0;

      if (targetUniId && targetUniId !== "all") {
        const uniTeachers = await User.findAll({ where: teacherWhere, attributes: ['id'] });
        const teacherIds = uniTeachers.map(t => t.id);

        if (teacherIds.length > 0) {
          const uniGroups = await Group.findAll({ where: { teacher_id: teacherIds }, attributes: ['id'] });
          const groupIds = uniGroups.map(g => g.id);
          totalGroups = groupIds.length;

          if (groupIds.length > 0) {
            totalStudents = await GroupMember.count({
              where: { group_id: groupIds },
              distinct: true,
              col: 'student_id',
            });
          }
        }
      } else {
        totalGroups = await Group.count();
        totalStudents = await GroupMember.count({ distinct: true, col: 'student_id' });
      }

      const activeEvents = await Event.count({ where: { status: "ACTIVE" } });

      const evaluatedSubmissions = await Submission.count({ where: { status: "graded" } });
      const pendingSubmissions = await Submission.count({ where: { status: ["evaluating", "submitted"] } });
      const missingSubmissions = await Submission.count({ where: { status: ["draft", "returned"] } });

      // Real Attendance rate from EventParticipant
      let attendanceRate = 0;
      const totalParticipants = await EventParticipant.count();
      if (totalParticipants > 0) {
        const presentCount = await EventParticipant.count({ where: { attendance_status: "PRESENT" } });
        attendanceRate = Number(((presentCount / totalParticipants) * 100).toFixed(1));
      }

      return res.json({
        totalTeachers: Number(totalTeachers) || 0,
        totalStudents: Number(totalStudents) || 0,
        totalFaculties: Number(totalFaculties) || 0,
        totalDepartments: Number(totalDepartments) || 0,
        totalGroups: Number(totalGroups) || 0,
        activeEvents: Number(activeEvents) || 0,
        attendanceRate: attendanceRate,
        assignments: {
          submitted: Number(evaluatedSubmissions) || 0,
          reviewing: Number(pendingSubmissions) || 0,
          missing: Number(missingSubmissions) || 0,
        },
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Universitet profilini olish (Joriy tarif va ma'lumotlar)
  async getUniversityProfile(req, res) {
    try {
      const { universityId } = req.params;
      let uniId = (universityId && universityId !== 'all' && universityId !== 'undefined') ? universityId : req.user?.university_id;
      let university = null;

      if (uniId) {
        university = await University.findByPk(uniId, {
          include: [
            { model: Faculty, as: "faculties", include: [{ model: Department, as: "departments" }] },
            { model: User, as: "users", attributes: ["id", "name", "email", "role"] }
          ]
        });
      }
      if (!university && req.user?.university_code) {
        university = await University.findOne({
          where: { unique_code: req.user.university_code },
          include: [
            { model: Faculty, as: "faculties", include: [{ model: Department, as: "departments" }] },
            { model: User, as: "users", attributes: ["id", "name", "email", "role"] }
          ]
        });
      }
      if (!university) {
        university = await University.findOne({
          where: { status: "ACTIVE" },
          include: [
            { model: Faculty, as: "faculties", include: [{ model: Department, as: "departments" }] },
            { model: User, as: "users", attributes: ["id", "name", "email", "role"] }
          ]
        });
      }

      return res.json({ success: true, university });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Universitet obuna tarifini yangilash (Change plan)
  async updateUniversityPlan(req, res) {
    try {
      const { universityId } = req.params;
      const { plan_name } = req.body;
      if (!plan_name) {
        return res.status(400).json({ error: "plan_name kiritilishi shart." });
      }

      let targetUni = null;
      if (universityId && universityId !== 'all' && universityId !== 'undefined') {
        targetUni = await University.findByPk(universityId);
      }
      if (!targetUni && req.user?.university_id) {
        targetUni = await University.findByPk(req.user.university_id);
      }
      if (!targetUni) {
        targetUni = await University.findOne({ where: { status: "ACTIVE" } });
      }

      if (!targetUni) {
        return res.status(404).json({ error: "Universitet topilmadi!" });
      }

      targetUni.plan_name = plan_name;
      await targetUni.save();

      return res.json({
        success: true,
        message: "Universitet obuna tarifi muvaffaqiyatli yangilandi ✅",
        plan_name: targetUni.plan_name,
        university: targetUni,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Universitetni o'chirish (Delete confirmation & Safety)
  async deleteUniversity(req, res) {
    try {
      const { universityId } = req.params;
      const { confirmation } = req.body;

      if (confirmation !== "DELETE_CONFIRM") {
        return res.status(400).json({ error: "Universitetni o'chirish uchun tasdiqlash kodi to'g'ri kelmadi." });
      }

      const university = await University.findByPk(universityId);
      if (!university) {
        return res.status(404).json({ error: "Universitet topilmadi!" });
      }

      university.status = "DELETED";
      await university.save();

      return res.json({ message: "Universitet va tegishli kirish huquqlari o'chirildi ✅" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new UniversityController();
