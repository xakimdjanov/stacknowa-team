const express = require("express");
const router = express.Router();
const universityController = require("../controllers/university.controller");
const { verifyToken, isAdmin, isUniversityAdmin } = require("../middlewares/auth");

// Universitet yaratish va unique code olish (Platform Admin)
router.post("/", verifyToken, isAdmin, universityController.createUniversity);

// Barcha universitetlar (Platform Admin)
router.get("/", verifyToken, universityController.getAllUniversities);

// Unique code bo'yicha tekshirish (Public - teacher registration)
router.get("/code/:code", universityController.getUniversityByCode);

// Universitet tahrirlash va status (Bloklash/Faollashtirish)
router.put("/:id", verifyToken, isAdmin, universityController.updateUniversity);
router.put("/:id/status", verifyToken, isAdmin, universityController.toggleUniversityStatus);

// Kutilayotgan va tasdiqlangan o'qituvchilar (University Admin & Platform Admin)
router.get("/:university_id/pending-teachers", verifyToken, universityController.getPendingTeachers);
router.get("/:university_id/teachers", verifyToken, universityController.getApprovedTeachers);

// Universitet guruhlari va guruh detallari
router.get("/:university_id/groups", verifyToken, universityController.getUniversityGroups);

// O'qituvchini tasdiqlash & biriktirish
router.put("/teachers/:userId/approve", verifyToken, universityController.approveTeacher);

// O'qituvchini rad etish
router.put("/teachers/:userId/reject", verifyToken, universityController.rejectTeacher);

// Universitet strukturasi (Fakultet va Kafedralar)
router.get("/:universityId/structure", verifyToken, universityController.getFacultiesAndDepartments);
router.post("/faculties", verifyToken, universityController.createFaculty);
router.post("/departments", verifyToken, universityController.createDepartment);

// Dashboard statistika
router.get("/:universityId/stats", verifyToken, universityController.getUniversityStats);

// Universitet profilini olish va tarifini yangilash
router.get("/:universityId/profile", verifyToken, universityController.getUniversityProfile);
router.put("/:universityId/plan", verifyToken, universityController.updateUniversityPlan);

// Universitetni o'chirish
router.delete("/:universityId", verifyToken, universityController.deleteUniversity);

module.exports = router;
