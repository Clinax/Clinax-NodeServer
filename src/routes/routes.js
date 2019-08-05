import { UserController, PatientController, Controller } from "../controllers";
import { UserModel } from "../models/user";
import jwt from "jsonwebtoken";
import { create400 } from "../utils";

function verify(req, res, next) {
  let token = req.headers.token;
  if (token) {
    jwt.verify(token, publicKey, (err, decoded) => {
      if (err) return create400(res, "Verification Failed", err);
      UserModel.findById(decoded.id, (err, user) => {
        if (err || !user) return create400(res, null, err);
        req.user = user;
        next();
      });
    });
  } else create400(res, "Login Reguired");
}

export default app => {
  app.post("/auth", UserController.login);
  app.delete("/auth/", UserController.logout);

  // Routes for user
  app.post("/user", UserController.create);
  app.get("/user/", verify, UserController.find);
  app.put("/user", verify, UserController.update);

  // Routes for patient
  app.get("/patient/:patientId", verify, PatientController.find);
  app.put("/patient/:patientId", verify, PatientController.update);
  app.delete("/patient/:patientId", verify, PatientController.delete);

  app.get("/patient", verify, PatientController.findAll);
  app.post("/patient", verify, PatientController.create);

  // Misc routes
  app.get("/regions/", verify, PatientController.getRegions);
  app.get("/drugs/", verify, PatientController.getDrugs);
  app.get("/search/:keyword", verify, Controller.search);
};
