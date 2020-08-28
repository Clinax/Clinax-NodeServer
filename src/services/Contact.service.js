import { compressToUTF16 } from "lz-string";
import { getColor } from "@pranavraut033/js-utils";
import { create400, create500 } from "@pranavraut033/js-utils/utils/httpErrors";
import UserContact from "../models/UserContact";
import Patient from "../models/Patient";

export async function getContacts(req, res) {
  let contacts = await UserContact.find({ addedBy: req.user._id });
  const patients = await Patient.find({ addedBy: req.user._id }).select(
    "-addedBy -emergencyContacts -__v"
  );

  contacts = [
    ...contacts.map((ev) => ({
      ...ev.toObject(),
      color: getColor(ev._id),
    })),
    ...patients
      .map((ev) => ev.toObject())
      .map((patient) => ({
        ...patient,
        type: "patient",
        autoAdded: true,
        color: getColor(patient._id),
        name: { ...patient.name, prefix: patient.prefix },
        displayName: patient.fullname || patient.phone || patient.email,
      })),
  ];

  res.json({
    contacts: String(compressToUTF16(JSON.stringify(contacts))),
    compression: "UTF16/lz-string",
  });
}

export async function createContact(req, res) {
  const contact = new UserContact(req.body);
  const error = contact.validateSync();

  if (error) return create400(res, `Validtion failed: ${error.message}`, error);
  await contact.save();

  res.json(contact.toObject());
}

export async function updateContact(req, res) {
  const Model = req.queryParams.isPatient === "true" ? Patient : UserContact;
  const updates = { ...req.body };

  // correction
  if (req.queryParams.isPatient) {
    if (updates.name) updates.prefix = updates.name.prefix;
  }

  Model.findOneAndUpdate({ _id: req.params.id }, updates, { new: true })
    .then((model) =>
      req.queryParams.isPatient === "true"
        ? {
            ...model.toObject(),
            type: "patient",
            autoAdded: true,
            color: getColor(model._id),
            name: { ...model.name, prefix: model.prefix },
            displayName: model.fullname || model.phone || model.email,
          }
        : { ...model.toObject(), color: getColor(model._id) }
    )
    .then((object) => res.json(object))
    .catch((err) => create500(res, err));
}
