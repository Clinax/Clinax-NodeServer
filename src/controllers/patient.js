import fs from 'fs'

import Utils, {
    create404,
    create500,
    create400
} from "../utils"

import {
    PatientModel
} from "../models/patient";

export function create(req, res) {
    if (!req.body.patient)
        return create400(res, "Patient attributes was not provided");

    if (!req.files) req.files = {};

    var patient = req.body.patient,
        avatar = req.files.avatar;
    if (avatar) patient = JSON.parse(patient)
    var patient = new PatientModel(patient)

    let path = `${appRoot}/uploads/img/${patient._id}`;
    fs.mkdir(path, () => {});

    if (avatar) {
        patient.avatar = `${patient._id}/${avatar.md5}.jpg`
        avatar.mv(`${path}/${avatar.md5}.jpg`)
    }

    patient.validate(err => {
        if (!err)
            patient.save()
            .then(data => res.json(data))
            .catch(err => create500(res, err.message))
        else create400(res, err.message)
    })
}

export function find(req, res) {
    PatientModel.findById(req.params.patientId)
        .then(patient => {
            if (!patient) return create404(res, `Patient with id '${req.params.patientId}' not found`)
            res.json(patient.toObject({
                virtuals: true
            }));
        }).catch(err => create500(res, `Failed to retrive patient with id '${req.params.patientId}'`, err));
}

export function update(req, res) {
    PatientModel.findById(req.params.patientId, (err, patient) => {
        if (err) return create404(res, `Failed to retrive patient with id '${req.params.patientId}'`, err);

        if (!patient) return create404(res, `Patient with id '${req.params.patientId}' not found`)

        for (var attr in req.body.updates)
            patient[attr] = req.body.updates[attr]

        patient.save()
            .then(patient => res.json(patient))
            .catch(err => Utils.create400(res, `Failed to update patient with id '${req.params.patientId}'`, err));
    })
}

export function findAll(_, res) {
    PatientModel.find()
        .then(patients => {
            var temp = [];
            patients.forEach(patient => {
                temp.push(patient.toObject({
                    virtuals: true
                }));
            });
            res.send(temp)
        })
        .catch(err => create500(res, "Failed to retrive patients details", err));
}

const _delete = (req, res) => {
    PatientModel.deleteOne({
            id: req.params.patientId
        }).then(n => res.send(n))
        .catch(err => create400(res, `Failed to delete patient with id: '${req.params.patientId}'`, err));
};

export {
    _delete as delete
};