import fs from "fs";
import path from "path";

export function scanAllPDFs(baseDir) {
  const results = [];

  const branches = fs.readdirSync(baseDir);

  for (const branch of branches) {
    const branchPath = path.join(baseDir, branch);

    // 🔒 SKIP FILES (like .zip)
    if (!fs.statSync(branchPath).isDirectory()) continue;

    const years = fs.readdirSync(branchPath);
    for (const yearFolder of years) {
      const yearPath = path.join(branchPath, yearFolder);
      if (!fs.statSync(yearPath).isDirectory()) continue;

      const year = Number(yearFolder.replace("year", ""));

      const sems = fs.readdirSync(yearPath);
      for (const semFolder of sems) {
        const semPath = path.join(yearPath, semFolder);
        if (!fs.statSync(semPath).isDirectory()) continue;

        const semester = Number(semFolder.replace("sem", ""));

        const files = fs.readdirSync(semPath);
        for (const file of files) {
          if (!file.toLowerCase().endsWith(".pdf")) continue;

          const isSyllabus = file.toLowerCase().includes("syllabus");
          const subject = file.split("-")[0].trim();

          let unit = null;
          if (!isSyllabus) {
            const match = file.match(/unit\s*(\d+)/i);
            if (match) unit = Number(match[1]);
          }

          results.push({
            branch,
            year,
            semester,
            subject,
            unit,
            type: isSyllabus ? "syllabus" : "notes",
            file
          });
        }
      }
    }
  }

  return results;
}
