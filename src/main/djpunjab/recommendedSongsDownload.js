import { get } from "../../utility/httpClient.js";
import { extractDownloadLinksFromPageHtml, sleep } from "../../utility/scraperUtils.js";
import { downloadFileToDir } from "../../utility/downloader.js";
import { ensureDir } from "../../utility/fileUtils.js";
import { DJ_PUNJAB_RECOMMENDED_SAVE_DIR, DJ_PUNJAB_RECOMMENDED_URL ,DJ_PUNJAB_DOWNLOAD_LIMIT } from "../../config/default.js";
export async function runRecommendedScrape() {
  ensureDir(DJ_PUNJAB_RECOMMENDED_SAVE_DIR);
  console.log("Fetching recommended pages...");
  const pages = await getUrlsList();

  for (const pageUrl of pages) {
    console.log(" Scraping Page:", pageUrl);

    const html = await get(pageUrl);
    const links = extractDownloadLinksFromPageHtml(html,["/320/",".mp3"]);

    console.log(`   • Found ${links.length} download links`);

    for (const link of links) {
      const absUrl = makeAbsoluteUrl(pageUrl, link);
      await downloadFileToDir(absUrl, DJ_PUNJAB_RECOMMENDED_SAVE_DIR);
      await sleep(500); 
    }

    await sleep(1000);
  }

  console.log("🎉 Recommended scrape completed.");
}
async function getUrlsList() {
  let urlsList=new Set();
  let html = await get(DJ_PUNJAB_RECOMMENDED_URL);
  let matches = html.match(/(?<=Pages :: \d*\/)\d*/g);
  let totalPages=parseInt(matches[0]);
  for(let i=1;i<totalPages;i++){
  html = await get(DJ_PUNJAB_RECOMMENDED_URL+"?page="+i);
  if(html &&  html.match){
     matches = [...html.match(/\/single-track\/[^"\s]*mp3[^"\s]*\.html/g)];
    if (matches.length === 0) {
      console.log(`No matches found for page ${i}`);
    } else {
      for (const m of matches) {
        urlsList.add("https://djpunjab.is"+m);
      }
      
    }
  }
  if(urlsList.size> DJ_PUNJAB_DOWNLOAD_LIMIT){
    break;
  }
  }
  return urlsList;
}

function makeAbsoluteUrl(base, link) {
  try {
    return new URL(link, base).href;
  } catch {
    return link;
  }
}

runRecommendedScrape();
