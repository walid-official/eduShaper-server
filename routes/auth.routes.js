// routes/auth.routes.js
import express from "express";
import { setToken, clearToken } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/jwt", setToken);
router.post("/logout", clearToken);

export default router;
