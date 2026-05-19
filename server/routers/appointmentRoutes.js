import { getAppointments } from "../contollers/appointmentController.js";
import express from 'express';
import { protect } from "../middlewares/authmiddleware.js";
import { authorize } from "../middlewares/authoriseRoleMiddleware.js";


const router = express.Router();

router.get(
  "/appointments",
  protect,
  authorize("super_admin", "receptionist"),
  getAppointments
);

export default router;