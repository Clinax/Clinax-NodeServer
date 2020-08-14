import UserContact from "../models/UserContact";
import Patient from "../models/Patient";

import { getPatientColor } from "../utils";
import { compressToUTF16 } from "lz-string";
import { create400, create500 } from "../utils/httpErrors";

export async function getContacts(req, res) {
  let contacts = await UserContact.find({ addedBy: req.user._id });
  let patients = await Patient.find({ addedBy: req.user._id }).select(
    "-addedBy -emergencyContacts -__v"
  );

  contacts = [
    ...contacts.map((ev) => ({
      ...ev.toObject(),
      color: getPatientColor(ev._id),
    })),
    ...patients
      .map((ev) => ev.toObject())
      .map((patient) => ({
        ...patient,
        type: "patient",
        autoAdded: true,
        color: getPatientColor(patient._id),
        name: { ...patient.name, prefix: patient.prefix },
        displayName: patient.prefixFullname || patient.phone || patient.email,
      })),
  ];

  res.json({
    contacts: String(compressToUTF16(JSON.stringify(contacts))),
    compression: "UTF16/lz-string",
  });
}

export async function createContact(req, res) {
  let contact = new UserContact(req.body);
  let error = contact.validateSync();

  if (error) return create400(res, "Validtion failed: " + error.message, error);
  await contact.save();

  res.json(contact.toObject());
}

export async function updateContact(req, res) {
  let Model = req.queryParams.isPatient == "true" ? Patient : UserContact;
  let updates = Object.assign({}, req.body);

  // correction
  if (req.queryParams.isPatient) {
    if (updates.name) updates.prefix = updates.name.prefix;
  }

  Model.findOneAndUpdate({ _id: req.params.id }, updates, { new: true })
    .then((model) =>
      req.queryParams.isPatient == "true"
        ? {
            ...model.toObject(),
            type: "patient",
            autoAdded: true,
            color: getPatientColor(model._id),
            name: { ...model.name, prefix: model.prefix },
            displayName: model.prefixFullname || model.phone || model.email,
          }
        : { ...model.toObject(), color: getPatientColor(model._id) }
    )
    .then((object) => res.json(object))
    .catch((err) => create500(res, err));
}
