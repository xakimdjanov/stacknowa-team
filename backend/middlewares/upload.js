const multer = require("multer");
const { S3Client } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");
const path = require("path");

const s3 = new S3Client({
  region: process.env.AWS_REGION || "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME || "stacknowa-files-2026",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      // AWS S3 ichida alohida 'ai/' papkasi ochiladi:
      cb(null, `ai/${fileName}`);
    },
  }),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB limit (Katta kitoblar, taqdimotlar va PDFlar bemalol sig'adi)
});

module.exports = upload;
