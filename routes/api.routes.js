import express from "express";
import { testUrl, webkhookapiUrl } from "../controllers/api.controller.js";

const router = express.Router();

router.get("/api", webkhookapiUrl);
router.post("/test", testUrl);

export default router;
