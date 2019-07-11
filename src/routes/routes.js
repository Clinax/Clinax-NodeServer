import {
    UserController,
    PatientController,
    Controller
} from '../controllers';

export default (app) => {
    app.post("/auth", UserController.login);
    app.get("/auth/:token", UserController.find);
    app.delete("/auth/:token", UserController.logout);

    // Routes for user
    app.post("/user", UserController.create);
    app.put("/user", UserController.update);

    // Routes for patient
    app.get("/:token/regions/", PatientController.getRegions);
    app.get("/:token/patient/:patientId", PatientController.find);
    app.put("/patient/:patientId", PatientController.update);
    app.delete("/patient/:patientId", PatientController.delete);

    app.get("/:token/patient", PatientController.findAll);
    app.post("/patient", PatientController.create);

    // Misc routes
    app.get("/search/:keyword", Controller.search)
}