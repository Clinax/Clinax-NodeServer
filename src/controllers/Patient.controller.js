import { create400, create500 } from "@pranavraut033/js-utils/utils/httpErrors";

export function validateAndSave(res, patient) {
  patient.validate((err) => {
    if (err) return create400(res, err);

    patient
      .save()
      .then((_patient) => res.json(_patient.toObject()))
      .catch(create500.bind(null, res));
  });
}
