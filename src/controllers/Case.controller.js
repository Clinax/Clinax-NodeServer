import { create400, create500 } from "@pranavraut033/js-utils/utils/httpErrors";

export function validateAndSave(res, _case) {
  _case.validate((err) => {
    if (err) return create400(res, err);

    _case
      .save()
      .then((__case) => res.json(__case.toObject()))
      .catch(create500.bind(null, res));
  });
}
