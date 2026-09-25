const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const { sequelize } = require("./models");
const initAdminAndPlans = require("./utils/initAdmin");

// Routes import
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const groupRoutes = require("./routes/group.routes");
const assignmentRoutes = require("./routes/assignment.routes");
const submissionRoutes = require("./routes/submission.routes");
const planRoutes = require("./routes/plan.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const uploadRoutes = require("./routes/upload.routes");
const setupSwagger = require("./swagger/swagger");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares (Katta hajmdagi ma'lumotlar va fayllar uchun 100mb limit)
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(cors({ origin: "*" }));

// Static fayllar (Local uploadlar uchun)
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// API Marshrutlari
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/upload", uploadRoutes);

// Swagger Docs
setupSwagger(app);

// Root Healthcheck
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "AI Practice Backend API is running successfully 🚀",
    swaggerDocs: "/api-docs",
  });
});

// Ma'lumotlar bazasiga ulanish va Serverni ishga tushirish
sequelize
  .sync({ alter: true })
  .then(async () => {
    console.log("PostgreSQL bazasiga muvaffaqiyatli ulandi ✅");
    await initAdminAndPlans();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server ishga tushdi 🚀`);
      console.log(`Lokal:   http://localhost:${PORT}`);
      console.log(`Swagger: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("Ma'lumotlar bazasiga ulanishda xatolik:", err.message);
  });

module.exports = app;
