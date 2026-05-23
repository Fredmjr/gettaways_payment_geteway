import express from "express";
import { crtusrUrl } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/crtusr", crtusrUrl);

export default router;
