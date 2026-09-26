const { Event, EventParticipant, User, Group } = require("../models");
const aiService = require("../services/ai.service");

const generateGamePin = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

class EventController {
  // AI orqali dars materialidan 20 ta savol generatsiya qilish
  async generate20Questions(req, res) {
    try {
      const { material_name = "Dars Materiali", material_text = "" } = req.body;
      const questions = await aiService.generate40Questions({
        materialText: material_text,
        documentTitle: material_name,
        count: 20,
      });

      return res.json({
        message: "AI orqali 20 ta savol muvaffaqiyatli shakllantirildi! ⚡",
        questionsCount: questions.length,
        questions,
      });
    } catch (err) {
      console.error("AI 20 Questions error:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  // AI orqali dars materialidan 40 ta savol generatsiya qilish
  async generate40Questions(req, res) {
    try {
      const { material_name = "Amaliy Ish", material_text = "" } = req.body;
      const questions = await aiService.generate40Questions({
        materialText: material_text,
        documentTitle: material_name,
        count: 40,
      });

      return res.json({
        message: "AI orqali 40 ta savol muvaffaqiyatli shakllantirildi! ⚡",
        questionsCount: questions.length,
        questions,
      });
    } catch (err) {
      console.error("AI 40 Questions error:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  // 03. Live Event yaratish (Game PIN beriladi)
  async createLiveEvent(req, res) {
    try {
      const { title, description, questions, group_id, material_name } = req.body;
      const teacher_id = req.user?.id || 1;

      const game_pin = generateGamePin();
      const eventQuestions = questions && questions.length > 0
        ? questions
        : await aiService.generate40Questions({ documentTitle: title || "Dars Materiali", count: 40 });

      const event = await Event.create({
        title: title || "AI PRACTICE Live Quiz",
        description,
        game_pin,
        status: "LOBBY",
        questions: eventQuestions,
        current_question_index: 0,
        teacher_id,
        group_id,
        material_name: material_name || "Dars Hujjati (PDF/PPTX)",
      });

      return res.status(201).json({
        message: "Live Event yaratildi! Game PIN kiritib talabalar qo'shilishi mumkin.",
        event,
        game_pin,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Game PIN bo'yicha eventga kirish (Student Join & Auto Davomat)
  async joinEventByPin(req, res) {
    try {
      const { game_pin, student_name } = req.body;
      const student_id = req.user?.id || null;

      const event = await Event.findOne({ where: { game_pin } });
      if (!event) {
        return res.status(404).json({ error: "Game PIN xato kiritildi yoki bunday Event mavjud emas!" });
      }

      // Online Davomatga avtomatik PRESENT deb yozish
      let participant = await EventParticipant.findOne({
        where: { event_id: event.id, student_name },
      });

      if (!participant) {
        participant = await EventParticipant.create({
          event_id: event.id,
          student_id,
          student_name: student_name || req.user?.name || "Talaba",
          score: 0,
          total_correct: 0,
          attendance_status: "PRESENT",
          answers: [],
        });
      }

      return res.json({
        message: "Eventga muvaffaqiyatli ulandingiz! Davomatda belgilandingiz (PRESENT) ✅",
        event: {
          id: event.id,
          title: event.title,
          status: event.status,
          material_name: event.material_name,
          questionsCount: event.questions?.length || 40,
        },
        participant,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // O'qituvchi Eventni Boshlash (Start Quiz)
  async startEvent(req, res) {
    try {
      const { id } = req.params;
      const event = await Event.findByPk(id);
      if (!event) return res.status(404).json({ error: "Event topilmadi" });

      event.status = "ACTIVE";
      event.current_question_index = 0;
      event.changed('updatedAt', true);
      await event.save();

      return res.json({ message: "Quiz boshlandi! 🚀", event });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Next Question (Keyingi savolga o'tish)
  async nextQuestion(req, res) {
    try {
      const { id } = req.params;
      const event = await Event.findByPk(id);
      if (!event) return res.status(404).json({ error: "Event topilmadi" });

      const nextIdx = event.current_question_index + 1;
      if (nextIdx >= (event.questions?.length || 40)) {
        event.status = "FINISHED";
      } else {
        event.current_question_index = nextIdx;
      }
      event.changed('updatedAt', true);
      await event.save();

      return res.json({ message: "Keyingi savolga o'tildi", event });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Talaba Javob Berishi (Real-time option click)
  async submitAnswer(req, res) {
    try {
      const { event_id, participant_id, question_index, selected_option_index } = req.body;
      const event = await Event.findByPk(event_id);
      let participant = null;

      if (participant_id) {
        participant = await EventParticipant.findByPk(participant_id);
      }
      if (!participant && event_id && req.user) {
        participant = await EventParticipant.findOne({
          where: { event_id, student_name: req.user.name },
        });
      }

      if (!event || !participant) {
        return res.status(404).json({ error: "Event yoki qatnashchi topilmadi!" });
      }

      const questions = event.questions || [];
      const currentQ = questions[question_index];
      const isCorrect = currentQ && Number(currentQ.correctIndex) === Number(selected_option_index);

      const rawAnswers = Array.isArray(participant.answers) ? [...participant.answers] : [];
      const updatedAnswers = rawAnswers.filter((a) => Number(a.question_index) !== Number(question_index));
      updatedAnswers.push({
        question_index: Number(question_index),
        selected_option_index: Number(selected_option_index),
        isCorrect,
      });

      participant.answers = updatedAnswers;
      participant.changed('answers', true);
      if (isCorrect) {
        participant.score = (participant.score || 0) + 100;
        participant.total_correct = (participant.total_correct || 0) + 1;
      }
      await participant.save();

      return res.json({
        isCorrect,
        correctIndex: currentQ?.correctIndex,
        explanation: currentQ?.explanation,
        currentScore: participant.score,
      });
    } catch (err) {
      console.error("submitAnswer error:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  // Event Statistika & Davomat (Teacher Live View & Online Attendance)
  async getEventLiveState(req, res) {
    try {
      const { id } = req.params;
      const event = await Event.findByPk(id, {
        include: [{ model: EventParticipant, as: "participants" }],
      });

      if (!event) return res.status(404).json({ error: "Event topilmadi" });

      const participants = event.participants || [];
      const totalParticipants = participants.length;
      const presentCount = participants.filter((p) => p.attendance_status === "PRESENT").length;

      return res.json({
        event: {
          id: event.id,
          title: event.title,
          status: event.status,
          game_pin: event.game_pin,
          current_question_index: event.current_question_index,
          questions: event.questions,
          material_name: event.material_name,
          duration_per_question: event.duration_per_question || 30,
          updatedAt: event.updatedAt,
        },
        participants,
        attendanceStats: {
          total: totalParticipants,
          present: presentCount,
          absent: 0,
        },
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // O'qituvchining barcha dars materiallari va savollari ro'yxati
  async getMyMaterials(req, res) {
    try {
      const teacher_id = req.user?.id || 1;
      const events = await Event.findAll({
        where: { teacher_id },
        include: [{ model: Group, as: "group", attributes: ["id", "name", "subject", "course"] }],
        order: [["createdAt", "DESC"]],
      });

      return res.json({
        materials: events,
      });
    } catch (err) {
      console.error("Get my materials error:", err);
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new EventController();
