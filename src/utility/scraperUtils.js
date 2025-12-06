import * as cheerio from "cheerio";

export function extractDownloadLinksFromPageHtml(html,contains) {
  const $ = cheerio.load(html);
  const links = [];
  const keywords = Array.isArray(contains) ? contains : [contains];
  $("a").each((_, a) => {
    const href = $(a).attr("href");
    if (!href) return;
    if ( keywords.every(keyword => 
      keyword ? href.includes(keyword) : true)) {
      links.push(href);
    }
  });

  return links;
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
