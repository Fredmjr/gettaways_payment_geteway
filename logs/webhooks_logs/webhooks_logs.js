import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "webhooks_logs.jsonl");

const stream = fs.createWriteStream(filePath, { flags: "a" });

export const webhooks_logs = (obj) => {
  const log_data = {
    service: "webhook",
    timestamp: new Date().toISOString(),
    data: obj,
  };

  stream.write(JSON.stringify(log_data) + "\n");
};
