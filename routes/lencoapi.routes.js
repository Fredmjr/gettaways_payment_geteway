import express from "express";
import {
  ckrpymntUrl,
  initUrl,
  lastreckrpymntUrl,
  paymntrsltUrl,
  reckrpymntUrl,
} from "../controllers/lencoapi.controller.js";

const router = express.Router();

router.post("/init", initUrl);
router.post("/ckrpymnt", ckrpymntUrl); //normal checker
router.post("/reckrpymnt", reckrpymntUrl); //10 sec checker
router.post("/lastreckrpymnt", lastreckrpymntUrl); //20 sec checker
router.post("/paymntrslt", paymntrsltUrl); //20 sec checker

export default router;
