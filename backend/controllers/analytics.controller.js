const { Group, GroupMember, Assignment, Submission, Evaluation, User } = require("../models");

/**
 * 1. O'qituvchi Guruh Tahliliy Ma'lumotlari (Teacher Dashboard & Analytics)
 */
exports.getGroupAnalytics = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findByPk(groupId, {
      include: [
        { model: GroupMember, as: "members" },
        {
          model: Assignment,
          as: "assignments",
          include: [
            {
              model: Submission,
              as: "submissions",
              include: [{ model: Evaluation, as: "evaluation" }, { model: User, as: "student" }],
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

    group.assignments.forEach((assignment) => {
      assignment.submissions.forEach((sub) => {
        totalSubmissions++;
        if (sub.evaluation) {
          totalScoreSum += sub.evaluation.total_score;
          scoredSubmissionsCount++;
          if (sub.evaluation.similarity_score > 30) highSimilarityCount++;
          if (sub.evaluation.ai_writing_probability > 0.5) highAiWritingCount++;
        }
      });
    });

    const averageScore = scoredSubmissionsCount > 0 ? (totalScoreSum / scoredSubmissionsCount).toFixed(1) : 0;

    return res.status(200).json({
      success: true,
      analytics: {
        group_name: group.name,
        total_students: totalStudents,
        total_assignments: group.assignments.length,
        total_submissions: totalSubmissions,
        average_score: Number(averageScore),
        similarity_alerts: highSimilarityCount,
        ai_writing_alerts: highAiWritingCount,
      },
      assignments: group.assignments,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
