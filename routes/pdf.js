import express from "express";
import fs from "fs";
import path from "path";
import { safeJoin } from "../utils/safePath.js";

const router = express.Router();
const DATA_DIR = path.join(process.cwd(), "data");

// 🔍 VIEW PDF
router.get("/pdf", (req, res) => {
  try {
    const { branch, file } = req.query;

    if (!branch || !file) return res.sendStatus(400);

    const basePath = path.join(DATA_DIR, branch);
    const filePath = safeJoin(basePath, file);

    if (!fs.existsSync(filePath)) return res.sendStatus(404);

    res.setHeader("Content-Type", "application/pdf");
    fs.createReadStream(filePath).pipe(res);
  } catch {
    res.sendStatus(403);
  }
});

// ⬇ DOWNLOAD PDF
router.get("/download", (req, res) => {
  try {
    const { branch, file } = req.query;

    const basePath = path.join(DATA_DIR, branch);
    const filePath = safeJoin(basePath, file);

    if (!fs.existsSync(filePath)) return res.sendStatus(404);

    res.download(filePath);
  } catch {
    res.sendStatus(403);
  }
});

export default router;
