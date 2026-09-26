const { Group, GroupMember, Assignment, Submission, Evaluation, User } = require("../models");

/**
 * 1. Guruh Tahliliy Ma'lumotlari (Single Group Analytics)
 */
exports.getGroupAnalytics = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findByPk(groupId, {
      include: [
        { 
          model: GroupMember, 
          as: "members",
          include: [{ model: User, as: "student", attributes: ["id", "name", "email"] }]
        },
        {
          model: Assignment,
          as: "assignments",
          include: [
            {
              model: Submission,
              as: "submissions",
              include: [{ model: Evaluation, as: "evaluation" }, { model: User, as: "student", attributes: ["id", "name", "email"] }],
            },
          ],
        },
      ],
    });

    if (!group) return res.status(404).json({ success: false, message: "Guruh topilmadi" });

    const totalStudents = group.members.length;
    let totalSubmissions = 0;
    let totalScoreSum = 0;
    let scoredSubmissionsCount = 0;
    let highSimilarityCount = 0;
    let highAiWritingCount = 0;

    const atRiskStudentsMap = new Map();

    group.assignments.forEach((assignment) => {
      assignment.submissions.forEach((sub) => {
        totalSubmissions++;
        if (sub.evaluation) {
          totalScoreSum += Number(sub.evaluation.total_score || 0);
          scoredSubmissionsCount++;
          if (sub.evaluation.similarity_score > 30) highSimilarityCount++;
          if (sub.evaluation.ai_writing_probability > 0.5) highAiWritingCount++;

          if (sub.student && sub.evaluation.total_score < 70) {
            atRiskStudentsMap.set(sub.student.id, {
              id: sub.student.id,
              name: sub.student.name,
              score: sub.evaluation.total_score,
              assignment: assignment.title,
            });
          }
        }
      });
    });

    const averageScore = scoredSubmissionsCount > 0 ? (totalScoreSum / scoredSubmissionsCount).toFixed(1) : "0.0";

    return res.status(200).json({
      success: true,
      analytics: {
        group_id: group.id,
        group_name: group.name,
        subject: group.subject,
        total_students: totalStudents,
        total_assignments: group.assignments.length,
        total_submissions: totalSubmissions,
        average_score: Number(averageScore),
        similarity_alerts: highSimilarityCount,
        ai_writing_alerts: highAiWritingCount,
      },
      assignments: group.assignments,
      at_risk_students: Array.from(atRiskStudentsMap.values()),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 2. Umumiy Tahliliy Ma'lumotlar (Overview Analytics for Teacher / University / Admin)
 */
exports.getOverviewAnalytics = async (req, res) => {
  try {
    let where = {};
    if (req.user.role === "TEACHER") {
      where = { teacher_id: req.user.id };
    }

    const groups = await Group.findAll({
      where,
      include: [
        {
          model: GroupMember,
          as: "members",
          include: [{ model: User, as: "student", attributes: ["id", "name", "email"] }],
        },
        {
          model: Assignment,
          as: "assignments",
          include: [
            {
              model: Submission,
              as: "submissions",
              include: [{ model: Evaluation, as: "evaluation" }, { model: User, as: "student", attributes: ["id", "name", "email"] }],
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    let totalStudentsSum = 0;
    let totalAssignmentsSum = 0;
    let totalSubmissionsSum = 0;
    let grandScoreSum = 0;
    let grandScoredCount = 0;

    const groupSummaries = groups.map((group) => {
      const studentCount = group.members.length;
      totalStudentsSum += studentCount;
      totalAssignmentsSum += group.assignments.length;

      let gScoreSum = 0;
      let gScoredCount = 0;
      let gSubmissions = 0;

      group.assignments.forEach((assignment) => {
        gSubmissions += assignment.submissions.length;
        assignment.submissions.forEach((sub) => {
          if (sub.evaluation) {
            gScoreSum += Number(sub.evaluation.total_score || 0);
            gScoredCount++;
            grandScoreSum += Number(sub.evaluation.total_score || 0);
            grandScoredCount++;
          }
        });
      });

      totalSubmissionsSum += gSubmissions;
      const gAvgScore = gScoredCount > 0 ? (gScoreSum / gScoredCount).toFixed(1) : "0.0";

      return {
        id: group.id,
        name: group.name,
        subject: group.subject,
        student_count: studentCount,
        assignment_count: group.assignments.length,
        submission_count: gSubmissions,
        average_score: Number(gAvgScore),
      };
    });

    const overallAverageScore = grandScoredCount > 0 ? (grandScoreSum / grandScoredCount).toFixed(1) : "0.0";

    return res.status(200).json({
      success: true,
      overview: {
        total_groups: groups.length,
        total_students: totalStudentsSum,
        total_assignments: totalAssignmentsSum,
        total_submissions: totalSubmissionsSum,
        average_score: Number(overallAverageScore),
      },
      group_summaries: groupSummaries,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
