import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "data.js");

export const test_saveData = (obj) => {
  //overwritecontents
  /*   const content = JSON.stringify(obj, null, 2);
  fs.writeFileSync(filePath, content, "utf8");
 */
  // Append contents
  const content = JSON.stringify(obj, null, 2);
  fs.appendFileSync(filePath, content + "\n", "utf8");
};

test_saveData(data);
