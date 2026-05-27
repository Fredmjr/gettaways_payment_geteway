import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import appRouter from "./routes/app.routes.js";
import apiRouter from "./routes/api.routes.js";
/* import userRouter from "./routes/user.routes.js"; */
import lencoRouter from "./routes/lenco.routes.js"; //raw body lenco api
import lencoapiRouter from "./routes/lencoapi.routes.js"; //normal lenco api
import sequelize from "./config/db.js";

const app = express();
const port = 8100;
//lenco - raw body data parsing
const lencoParser = express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  },
});
app.use("/lenco", lencoParser, lencoRouter);

//normal global parsing
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(__filename);
app.set("view engine", "hbs");
app.set("/views", path.join(__dirname, "views", "components"));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.hbs");
});
app.get("/srch", (req, res) => {
  res.render("srchpg.hbs");
});

app.use("/app", appRouter);
app.use("/api", apiRouter);
/* app.use("/usr", userRouter); */
app.use("/lencoapi", lencoapiRouter);

(async () => {
  await sequelize.sync();
  app.listen(port, () => {
    console.log("Application running");
  });
})();
