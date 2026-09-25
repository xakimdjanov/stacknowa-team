const { Submission, Assignment, Evaluation, User, Group } = require("../models");
const aiService = require("../services/ai.service");

/**
 * 1. Digital White Paper - Draft saqlash (Autosave)
 */
exports.saveDraft = async (req, res) => {
  try {
    const { assignment_id, content, attached_images } = req.body || {};

    let submission = await Submission.findOne({
      where: { assignment_id, student_id: req.user.id },
    });

    if (submission) {
      if (submission.status === "graded" && !submission.allow_resubmission) {
        return res.status(400).json({ success: false, message: "Ushbu ish baholangan, qayta tahrirlash mumkin emas" });
      }
      submission.content = content || submission.content;
      if (attached_images) submission.attached_images = attached_images;
      submission.status = "draft";
      await submission.save();
    } else {
      submission = await Submission.create({
        assignment_id,
        student_id: req.user.id,
        content,
        attached_images: attached_images || [],
        status: "draft",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Qoralama saqlandi (Autosaved)",
      submission,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 2. Topshirish (Submit) va AI Evaluation Pipeline
 */
exports.submitWork = async (req, res) => {
  try {
    const { assignment_id, content, attached_images } = req.body || {};

    const assignment = await Assignment.findByPk(assignment_id, {
      include: [
        { 
          model: Group, 
          as: "group",
          include: [{ model: User, as: "teacher" }]
        }
      ],
    });
    if (!assignment) return res.status(404).json({ success: false, message: "Topshiriq topilmadi" });

    let submission = await Submission.findOne({
      where: { assignment_id, student_id: req.user.id },
    });

    if (!submission) {
      submission = await Submission.create({
        assignment_id,
        student_id: req.user.id,
        content,
        attached_images: attached_images || [],
        status: "submitted",
        submitted_at: new Date(),
      });
    } else {
      submission.content = content || submission.content;
      if (attached_images) submission.attached_images = attached_images;
      submission.status = "submitted";
      submission.version += 1;
      submission.submitted_at = new Date();
      await submission.save();
    }

    // Guruhdagi boshqa ishlarni plagiat tahlili uchun olamiz
    const otherSubmissions = await Submission.findAll({
      where: { assignment_id, status: ["submitted", "graded"] },
      attributes: ["id", "content"],
    });

    // O'qituvchining tarifi PRO mi yoki FREE?
    const teacher = assignment.group?.teacher;
    const isPro = teacher?.plan_type === "PRO";

    // AI Evaluation Pipeline ishga tushirish
    const evalResult = await aiService.evaluateSubmission({
      submissionContent: submission.content,
      assignmentTitle: assignment.title,
      rubric: assignment.rubric,
      templateFileUrl: assignment.template_file_url,
      attachedImages: submission.attached_images || [],
      isPro,
      otherSubmissions: otherSubmissions.filter((s) => s.id !== submission.id),
    });

    // Natijalarni Evaluation jadvaliga saqlash
    let evaluation = await Evaluation.findOne({ where: { submission_id: submission.id } });

    const evaluationPayload = {
      submission_id: submission.id,
      total_score: evalResult.totalScore,
      max_score: evalResult.maxScore,
      criteria_results: evalResult.criteria,
      template_compliance: evalResult.templateCompliance,
      feedback: evalResult.feedback,
      similarity_score: evalResult.similarity ? evalResult.similarity.overall : null,
      similarity_details: evalResult.similarity ? evalResult.similarity.matchedSections : null,
      ai_writing_probability: evalResult.aiWriting ? evalResult.aiWriting.probability : null,
      ai_writing_confidence: evalResult.aiWriting ? evalResult.aiWriting.confidence : null,
      ai_writing_indicators: evalResult.aiWriting ? evalResult.aiWriting.indicators : null,
    };

    if (evaluation) {
      Object.assign(evaluation, evaluationPayload);
      await evaluation.save();
    } else {
      evaluation = await Evaluation.create(evaluationPayload);
    }

    submission.status = "graded";
    await submission.save();

    return res.status(200).json({
      success: true,
      message: "Topshiriq qabul qilindi va AI tomonidan baholandi!",
      submission,
      evaluation,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 3. Submission Detail
 */
exports.getSubmissionDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await Submission.findByPk(id, {
      include: [
        { model: User, as: "student", attributes: ["id", "name", "email"] },
        { model: Assignment, as: "assignment" },
        { model: Evaluation, as: "evaluation" },
      ],
    });

    if (!submission) return res.status(404).json({ success: false, message: "Ish topilmadi" });

    if (req.user.role === "STUDENT" && submission.student_id !== req.user.id) {
      return res.status(403).json({ success: false, message: "Boshqa talabaning ishini ko'rishga ruxsat yo'q" });
    }

    return res.status(200).json({ success: true, submission });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 4. O'qituvchi uchun topshiriq bo'yicha barcha submissionlar
 */
exports.getAssignmentSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const submissions = await Submission.findAll({
      where: { assignment_id: assignmentId },
      include: [
        { model: User, as: "student", attributes: ["id", "name", "email"] },
        { model: Evaluation, as: "evaluation" },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({ success: true, submissions });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 5. O'qituvchi topshiriqni qayta topshirish uchun talabaga qaytarishi
 */
exports.returnSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { teacher_comment } = req.body || {};

    const submission = await Submission.findByPk(id, {
      include: [
        { 
          model: Assignment, 
          as: "assignment", 
          include: [{ model: Group, as: "group" }] 
        },
        { model: Evaluation, as: "evaluation" },
        { model: User, as: "student", attributes: ["id", "name", "email"] },
      ],
    });

    if (!submission) {
      return res.status(404).json({ success: false, message: "Topshiriq ishi topilmadi" });
    }

    // Faqat o'qituvchi yoki admin qaytara oladi
    const isTeacher = req.user.role === "ADMIN" || submission.assignment?.group?.teacher_id === req.user.id;
    if (!isTeacher) {
      return res.status(403).json({ success: false, message: "Ishni qaytarishga faqat fan o'qituvchisi vakolatli" });
    }

    submission.status = "returned";
    await submission.save();

    // Agar o'qituvchi izoh yozgan bo'lsa, uni evaluation.feedback ga qo'shamiz
    if (teacher_comment && submission.evaluation) {
      let currentFeedback = submission.evaluation.feedback;
      const note = `O'qituvchi eslatmasi (Qayta topshirish talabi): ${teacher_comment}`;
      if (Array.isArray(currentFeedback)) {
        submission.evaluation.feedback = [note, ...currentFeedback];
      } else if (typeof currentFeedback === 'string') {
        submission.evaluation.feedback = `${note}\n\n${currentFeedback}`;
      } else {
        submission.evaluation.feedback = [note];
      }
      await submission.evaluation.save();
    }

    return res.status(200).json({
      success: true,
      message: "Amaliy ish talabaga qayta topshirish uchun muvaffaqiyatli qaytarildi",
      submission,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

