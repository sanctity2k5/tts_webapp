const express = require("express");
const session = require("express-session");
const multer = require("multer");
const bodyParser = require("body-parser");
const FormData = require("form-data");
const stream = require("stream");
const fs = require("fs");
const app = express();
const path = require("path");
const { exec } = require("child_process");
const { v4: uuidv4 } = require("uuid");
const licenseController = require("./backend/controller/licenseController");
const globalErrorHandler = require("./backend/controller/errorController");
const AppError = require("./backend/utils/appError");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: function (req, file, cb) {
    if (file.mimetype === "application/pdf") {
      const newFilename = "pitchDeck_" + Date.now() + ".pdf";
      cb(null, newFilename);
    } else {
      cb(null, file.originalname);
    }
  },
});

const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));

app.use(
  session({
    secret: "NOT_SECURE", // Utilisez une chaîne secrète forte
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Mettez à true si vous êtes derrière un proxy HTTPS
  })
);

// Route for license key verification
app.post("/verifyLicense", licenseController.createLicenseKey);

// Use the middleware function in your route
app.get("/assistant.html/:id", licenseController.protectRoute, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "../pages/assistant.html"));
});

app.patch("/updateLicense", licenseController.updateLicense);

app.post("/uploadAudio", upload.single("audioFile"), async (req, res) => {
  createUniqueID(req);
  if (!req.file) return res.status(400).send("Aucun fichier audio téléchargé.");
  console.log(req.file);
  const filePath = `/uploads/${req.file.filename}`;
  replyTTSPath = await SpeechToGPTToTTS(req, "." + filePath);
  console.log("input " + filePath);
  console.log("output " + replyTTSPath);

  res.json({ filePath: replyTTSPath });
});

app.post("/uploadPitchDeck", upload.single("pitchDeck"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("Aucun fichier téléchargé.");
  }
  console.log(req.file);
  const filePath = `./uploads/${req.file.filename}`;

  replyPitchPath = await uploadPitchAndFeedBack(req, filePath, res);
  res.json({ filePath: replyPitchPath });
});

async function uploadPitchAndFeedBack(req, filePath, res) {
  try {
    const textResult = await runPythonScript(
      "pitchDeckFile.py",
      req.session.userId,
      filePath
    );
    console.log(textResult);
    return textResult;
  } catch (error) {
    console.error("Erreur lors du traitement :", error);
  }
}

async function SpeechToGPTToTTS(req, filePath) {
  try {
    const textResult = await runPythonScript(
      "transcribe.py",
      req.session.userId,
      filePath
    );
    console.log(textResult);
    return textResult;
  } catch (error) {
    console.error("Erreur lors du traitement :", error);
  }
}

function runPythonScript(scriptName, argument1, argument2) {
  const scriptPath = "./scripts/"; // URL de votre serveur Express
  return new Promise((resolve, reject) => {
    exec(
      `python3 ${scriptPath + scriptName} ${argument1} ${argument2}`,
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout.trim());
        }
      }
    );
  });
}

function createUniqueID(req) {
  req.session.userId = uuidv4();
  console.log(req.session.userId);
}

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
