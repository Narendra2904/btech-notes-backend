import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());

const BRANCH_MAP = {
  "CSE-AIML": "CSE-AIML/CSE(AIML)",
  "CSE-DESIGN": "CSE-DESIGN/CSE(DESIGN)",
  "CSE-DS": "CSE-DS/CSE(DS)",
  "CSE": "CSE/CSE",
  "CIV": "CIV/CIV",
  "ECE": "ECE/ECE",
  "EEE": "EEE/EEE",
  "MECH": "MECH/MECH"
};


// ✅ Health check
app.get("/api/pdf", (req, res) => {
  const branchKey = decodeURIComponent(req.query.branch);
  const file = decodeURIComponent(req.query.file);

  const branchPath = BRANCH_MAP[branchKey];
  if (!branchPath) {
    return res.status(400).json({ error: "Invalid branch" });
  }

  const filePath = path.join(__dirname, "data", branchPath, file);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "PDF not found" });
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline");
  fs.createReadStream(filePath).pipe(res);
});


// ===============================
// ⬇ DOWNLOAD PDF
// ===============================
app.get("/api/download", (req, res) => {
  const branchKey = decodeURIComponent(req.query.branch);
  const file = decodeURIComponent(req.query.file);

  const branchPath = BRANCH_MAP[branchKey];
  if (!branchPath) {
    return res.status(400).json({ error: "Invalid branch" });
  }

  const filePath = path.join(__dirname, "data", branchPath, file);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "PDF not found" });
  }

  res.download(filePath);
});

app.get("/api/list", (req, res) => {
  const { branch, year, sem } = req.query;

  const folderBranch = BRANCH_MAP[branch] || branch;

  const dirPath = path.join(
    __dirname,
    "data",
    folderBranch,
    `year${year}`,
    `sem${sem}`
  );

  if (!fs.existsSync(dirPath)) return res.json([]);

  const files = fs.readdirSync(dirPath)
    .filter(f => f.endsWith(".pdf"));

  const grouped = {};
  files.forEach(file => {
    const subject = file.split("-")[0].trim();
    if (!grouped[subject]) grouped[subject] = [];
    grouped[subject].push(file);
  });

  res.json(
    Object.keys(grouped).map(subject => ({
      subject,
      files: grouped[subject]   // 👈 exact filenames
    }))
  );
});



// ===============================
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
