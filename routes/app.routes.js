import express from "express";

import { appUrl } from "../controllers/app.controller.js";
const router = express.Router();

router.get("/eg", appUrl);

export default router;
