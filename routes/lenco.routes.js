import express from "express";
import { webkhookapiUrl } from "../controllers/api.controller.js";

const router = express.Router();

router.post("/webkhook", webkhookapiUrl);

export default router;
