import { getAppointments } from "../contollers/appointmentController.js";
import express from 'express';
import { protect } from "../middlewares/authmiddleware.js";
import { authorize } from "../middlewares/authoriseRoleMiddleware.js";


const router = express.Router();

// router.get(
//   "/walk-in",
//   protect,
//   authorize("super_admin", "receptionist"),
//   getWalkInAppointments
// );

// router.get(
//   "/pre-scheduled",
//   protect,
//   authorize("super_admin", "receptionist"),
//   getPreScheduledAppointments
// );

// router.get(
//   "/past",
//   protect,
//   authorize("super_admin", "receptionist"),
//   getPastAppointments
// );

router.get(
  "/appointments",
  protect,
  authorize("super_admin", "receptionist"),
  getAppointments
);

export default router;