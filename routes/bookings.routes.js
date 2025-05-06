// routes/bookings.routes.js
import express from "express";
import {
  addBooking,
  getBookings,
  getAllBookings,
  deleteBooking,
} from "../controllers/bookings.controller.js";

const router = express.Router();

router.post("/bookings", addBooking);
router.get("/bookings", getBookings);
router.get("/allBookings", getAllBookings);
router.delete("/bookings/:id", deleteBooking);

export default router;
