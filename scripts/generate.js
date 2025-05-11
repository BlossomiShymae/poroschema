import { getExtendedHelp, getSwagger } from "@hasagi/schema";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { Agent } from "undici";

const FOLDER_SCHEMAS = "schemas";
await mkdir(FOLDER_SCHEMAS, { recursive: true });

// LCU schema
console.log("Generating LCU schema...");
const { extendedSchema } = await getExtendedHelp(true);
const swaggerObj = await getSwagger(extendedSchema);
await writeFile(path.join(FOLDER_SCHEMAS, "lcu.json"), JSON.stringify(swaggerObj, null, 4));

// Lol Client schema
console.log("Generating Game Client schema...");
const agent = new Agent({
  connect: {
    rejectUnauthorized: false
  }
});
const lolClientRes = await fetch("https://127.0.0.1:2999/swagger/v3/openapi.json", { dispatcher: agent });
const lolClientSwagger = await lolClientRes.json();
await writeFile(path.join(FOLDER_SCHEMAS, "lolclient.json"), JSON.stringify(lolClientSwagger, null, 4));
await agent.close();

// Riot API schema
console.log("Generating Riot API schema...");
const riotApiSchema = await fetch("https://www.mingweisamuel.com/riotapi-schema/openapi-3.0.0.json");
const riotApiSwagger = await riotApiSchema.json();
await writeFile(path.join(FOLDER_SCHEMAS, "riotapi.json"), JSON.stringify(riotApiSwagger, null, 4));