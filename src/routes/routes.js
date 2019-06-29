import {
    UserController,
    PatientController
} from '../controllers';

export default (app) => {
    app.post("/auth", UserController.login);
    app.get("/auth/:token", UserController.find);
    app.delete("/auth/:token", UserController.logout);

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