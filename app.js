const express = require("express");
const session = require("express-session");
const multer = require("multer");
const axios = require("axios");
const bodyParser = require("body-parser");
const FormData = require("form-data");
const stream = require("stream");
const fs = require("fs");
const app = express();
const port = 3000;
const path = require("path");
const { exec } = require("child_process");
const { v4: uuidv4 } = require("uuid");

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

app.use(express.static(path.join(__dirname, 'public')));
app.use("/uploads", express.static("uploads"));

app.use(
  session({
    secret: "NOT_SECURE", // Utilisez une chaîne secrète forte
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Mettez à true si vous êtes derrière un proxy HTTPS
  })
);

// Middleware for license key verification
async function verifyLicense(req, res, next) {
    if (req.session.licenseKey) {
      try {
        const response = await axios.post('https://api.gumroad.com/v2/licenses/verify', {
            product_id: 'b1iJGjyEG5cV7qthXIbcMw==',
            license_key: req.session.licenseKey,
            increment_uses_count: true
        });
        if (response.data.success) {
          next(); // If the license key is valid, proceed to the route handler
          console.log('License key verified');
        } else {
          res.redirect('index.html'); // If the license key is not valid, redirect to purchase page
        }
      } catch (error) {
        console.error('Error verifying license:', error);
        res.status(500).send('Error verifying license');
      }
    } else {
      res.redirect('index.html'); // If no license key is found in the session, redirect to purchase page
    }
  }
  
  // Route for license key verification
  app.post('/verifyLicense', async (req, res) => {
      try {
          const licenseKey = req.body.licenseKey; // Assuming you're sending the license key in the request body
  
          // Make the request to verify the license key
          const response = await axios.post('https://api.gumroad.com/v2/licenses/verify', {
              product_id: 'b1iJGjyEG5cV7qthXIbcMw==',
              license_key: licenseKey,
              increment_uses_count: true
          });
  
          // Check if the response indicates success
          if (response.data.success) {
              req.session.licenseKey = licenseKey; // Store the license key in the session
              res.json({ success: true });
          } else {
              // If the response indicates failure, handle it accordingly
              res.json({ success: false, message: 'License key verification failed' });
          }
      } catch (error) {
          // Handle errors that may occur during the asynchronous operation
          console.error('Error verifying license key:', error.message);
          res.status(500).json({ success: false, message: 'Internal server error' });
      }
  });
  
  
 // Use the middleware function in your route
app.get('/assistant.html', verifyLicense, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '../pages/assistant.html'));
  });


  
app.post("/uploadAudio",
  upload.single("audioFile"),
  async (req, res) => {
    createUniqueID(req);
    if (!req.file)
      return res.status(400).send("Aucun fichier audio téléchargé.");
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
  if (!req.session.userId) {
    req.session.userId = uuidv4();
    console.log(req.session.userId);
  }
}

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
