// routes/services.routes.js
import express from "express";
import {
  addService,
  getServices,
  getAllServices,
  searchServices,
  getUserServices,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/services.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/addService", verifyToken, addService);
router.get("/services", getServices);
router.get("/allServices", getAllServices);
router.get("/allServices/search", searchServices);
router.get("/services/:email", verifyToken, getUserServices);
router.get("/service/:id", verifyToken, getServiceById);
router.patch("/updateService/:id", updateService);
router.delete("/deleteService/:id", deleteService);

export default router;