import { getAppointmentsService } from "../services/appointmentService.js";
import asyncHandler from "../utils/asyncHandler.js";


// export const getWalkInAppointments = asyncHandler(async (req, res) => {

//   const page = Number(req.query.page) || 1;
//   const limit = Number(req.query.limit) || 10;

//   const data = await getAppointmentsService({
//     type: "walkin",
//     page,
//     limit,
//   });

//   res.status(200).json({
//     success: true,
//     ...data,
//   });
// });

// export const getPreScheduledAppointments = asyncHandler(async (req, res) => {

//   const page = Number(req.query.page) || 1;
//   const limit = Number(req.query.limit) || 10;

//   const data = await getAppointmentsService({
//     type: "prescheduled",
//     page,
//     limit,
//   });

//   res.status(200).json({
//     success: true,
//     ...data,
//   });
// });

// export const getPastAppointments = asyncHandler(async (req, res) => {

//   const page = Number(req.query.page) || 1;
//   const limit = Number(req.query.limit) || 10;

//   const data = await getAppointmentsService({
//     type: "past",
//     page,
//     limit,
//   });

//   res.status(200).json({
//     success: true,
//     ...data,
//   });
// });

export const getAppointments = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const {
    type,
    search = "",
    is_approve,
    is_preschedule,
    date,
  } = req.query;

  const data = await getAppointmentsService({
    type,
    page,
    limit,
    search,
    is_approve:
      is_approve === "true"
        ? true
        : is_approve === "false"
        ? false
        : null,
    is_preschedule:
      is_preschedule === "true"
        ? true
        : is_preschedule === "false"
        ? false
        : null,
    date,
  });

  res.status(200).json({
    success: true,
    ...data,
  });
});