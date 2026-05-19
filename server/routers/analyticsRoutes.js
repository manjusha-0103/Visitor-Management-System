import express from "express";
import {protect} from "../middlewares/authmiddleware.js";
import { authorize } from "../middlewares/authoriseRoleMiddleware.js";
import validate from "../middlewares/validate.js";
import { analyticsHederData,
    analyticsGraphn
 } from "../contollers/analyticsController.js";

const router = express.Router();

router.get("/analytics-header", protect, authorize('super_admin'), analyticsHederData)
router.get("/graph-data", analyticsGraphn)

export default router