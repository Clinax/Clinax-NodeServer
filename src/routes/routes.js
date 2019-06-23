import {
    UserController,
    PatientController
} from '../controllers';

export default (app) => {
    app.get("/auth", UserController.login);

    // Routes for user
    app.post("/user", UserController.create);
    app.put("/user", UserController.update);

    // Routes for patient
    app.get("/patient/:patientId", PatientController.find);
    app.put("/patient/:patientId", PatientController.update);
    app.delete("/patient/:patientId", PatientController.delete);

    app.get("/patient", PatientController.findAll);
    app.post("/patient", PatientController.create);
}