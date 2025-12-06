import axios from "axios";
import fs from "fs";
import path from "path";

export async function downloadFileToDir(url, dir, fileName = null) {
  try {
    const res = await axios({
      url,
      method: "GET",
      responseType: "stream",
      maxRedirects: 5,
    });

    let finalName =
      fileName ||  path.basename(url.split("?")[0]).replaceAll('%20',"") ||`file_${Date.now()}.bin`;
    finalName = finalName.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const outPath = path.join(dir, finalName);
    const writer = fs.createWriteStream(outPath);
    await new Promise((resolve, reject) => {
      res.data.pipe(writer);
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
    console.log("✅ Downloaded:", finalName);
    return outPath;
  } catch (err) {
    console.error("❌ DOWNLOAD FAILED:", url, err.message);
    return null;
  }
}
