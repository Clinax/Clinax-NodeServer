import stc from "string-to-color";

export const isProduction = () => process.env.NODE_ENV === "production";

export const SchemaTypes = {
  trimmedString: { type: String, trim: true },
};

let colorMap = {};
/**
 *
 * @param {String} patientId
 */
export function getPatientColor(patientId) {
  return colorMap[patientId] || (colorMap[patientId] = stc(patientId));
}
