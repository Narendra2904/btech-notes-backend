import axios from "axios";
import fs from "fs";
import path from "path";
import unzipper from "unzipper";

const DATA_DIR = path.join(process.cwd(), "data");

// 🔁 CHANGE THIS if you rename release
const RELEASE_API =
  "https://api.github.com/repos/Narendra2904/Btech-notes/releases/tags/notes-v1";

export async function prepareFiles() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

  console.log("📦 Fetching GitHub release info...");

  const release = await axios.get(RELEASE_API, {
    headers: { Accept: "application/vnd.github+json" }
  });

  for (const asset of release.data.assets) {
    const zipName = asset.name;
    const branch = zipName.replace(".zip", "");
    const extractPath = path.join(DATA_DIR, branch);

    if (fs.existsSync(extractPath)) {
      console.log(`✔ ${branch} already extracted`);
      continue;
    }

    console.log(`⬇ Downloading ${zipName}`);

    const zipPath = path.join(DATA_DIR, zipName);
    const response = await axios.get(asset.browser_download_url, {
      responseType: "stream"
    });

    await new Promise(resolve =>
      response.data.pipe(fs.createWriteStream(zipPath)).on("finish", resolve)
    );

    console.log(`📂 Extracting ${zipName}`);

    await fs
      .createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: extractPath }))
      .promise();
  }

  console.log("🎉 All PDFs ready");
}
