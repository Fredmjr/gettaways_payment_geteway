import express from "express";
import { webkhookapiUrl } from "../controllers/api.controller.js";

const router = express.Router();

router.get("/api", webkhookapiUrl);

export default router;
