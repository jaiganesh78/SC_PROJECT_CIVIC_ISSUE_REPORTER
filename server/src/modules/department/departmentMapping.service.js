/**
 * Rule-based category → department mapping
 * NO database dependency
 * Admin can override later if needed
 */

const CATEGORY_DEPARTMENT_MAP = {
  garbage_overflow: "Sanitation",
  pothole: "Roads",
  water_stagnation: "Water",
  drainage_overflow: "Drainage",
  street_light_failure: "Electrical",
  hospital_infrastructure: "Health",
};

/**
 * Returns department name string or null
 * null → admin review required
 */
const getDepartmentForCategory = (category) => {
  if (!category) return null;
  return CATEGORY_DEPARTMENT_MAP[category] || null;
};

module.exports = { getDepartmentForCategory };
