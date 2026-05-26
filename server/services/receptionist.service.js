import sql from "../db/database.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const setPassIdService = async (appointment_id, data) => {
  const { pass_id } = data;
  const [amp] = await sql`
        UPDATE "Appointments" 
        SET "pass_id" = ${pass_id}
        WHERE id = ${appointment_id}
        RETURNING *
    `;

  if (!amp) {
    throw new ApiError(404, "Appointment not found");
  }

  return amp;
};

const checkOutService = asyncHandler(async (appointment_id) => {
  const date_time = new Date();

  const [amp] = await sql`
        UPDATE "Appointments" 
        SET "check_out" = ${date_time}
        WHERE id = ${appointment_id}
        RETURNING *
    `;

  if (!amp) {
    throw new ApiError(404, "Appointment not found");
  }

  return amp;
});

export { setPassIdService, checkOutService };
