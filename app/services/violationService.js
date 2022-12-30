import { executeQuery } from "../database/database.js";

const addViolation = async (drone_id, closest_distance, pilot_name, email, phone) => {
  await executeQuery(
    `INSERT INTO violations
      (drone_id, closest_distance, pilot_name, email, phone, last_seen) VALUES ($drone_id, $closest_distance, $pilot_name, $email, $phone, NOW()::timestamp)`,
    {
      drone_id: drone_id,
      closest_distance: closest_distance,
      pilot_name: pilot_name,
      email: email,
      phone: phone,
    },
  );
};

const findViolationById = async (drone_id) => {
  const res = await executeQuery(`SELECT * FROM violations WHERE drone_id = $drone_id`, {
    drone_id: drone_id,
  });

  return res.rows;
};

const updateViolationLastSeenById = async (drone_id) => {
  await executeQuery(`UPDATE violations SET last_seen = NOW()::timestamp WHERE drone_id = $drone_id`, {
    drone_id: drone_id,
  });
};

const updateViolationPilotInformationById = async (drone_id, pilot_name, email, phone) => {
  await executeQuery(`UPDATE violations SET pilot_name = $pilot_name, email = $email, phone = $phone WHERE drone_id = $drone_id`, {
    drone_id: drone_id,
    pilot_name: pilot_name,
    email: email,
    phone: phone,
  });
};

const updateViolationDistanceById = async (drone_id, closest_distance) => {
  await executeQuery(`UPDATE violations SET closest_distance = $closest_distance WHERE drone_id = $drone_id`, {
    closest_distance: closest_distance,
    drone_id: drone_id,
  });
};

const listViolations = async () => {
  const res = await executeQuery(
    `SELECT * FROM violations WHERE last_seen > NOW() - INTERVAL '10 minutes' ORDER BY last_seen desc`,
  );
  return res.rows;
};

const deleteOldViolations = async () => {
  await executeQuery(
    `DELETE FROM violations WHERE last_seen < NOW() - INTERVAL '10 minutes'`,
  );
};

export { addViolation, findViolationById, listViolations, updateViolationLastSeenById, updateViolationDistanceById, deleteOldViolations, updateViolationPilotInformationById }