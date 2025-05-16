import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const FOLDER_OTHER = "other";
await mkdir(FOLDER_OTHER, { recursive: true });

// Fetch language list
console.log("Fetching languages...");
const res = await fetch("https://api.github.com/repositories/91109585/contents/libraries");
const root = await res.json();
const languages = root.map(x => x.name);

// Fetch libraries
console.log("Fetching langauges...");
const libs = [];
for (const language of languages) {
    console.log(`Fetching for langauge '${language}'...`);
    const res = await fetch(`https://api.github.com/repositories/91109585/contents/libraries/${language}`);
    const folder = await res.json();
    const links = folder.map(x => x.download_url);
    for (const link of links) {
      console.log(`Fetching ${link}`);
      const res = await fetch(link);
      const lib = await res.json();
      libs.push(lib);
      await sleep(50);
    }
}

await writeFile(path.join(FOLDER_OTHER, "libraries.json"), JSON.stringify(libs, null, 4));