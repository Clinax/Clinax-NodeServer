import AuthRouter from "./AuthRouter";
import PatientRouter from "./PatientRouter";
import CaseRouter from "./CaseRouter";
import UserRouter from "./UserRouter";

export default function (app) {
  app.use(AuthRouter);

  app.use(UserRouter);

  app.use(PatientRouter);

  app.use(CaseRouter);
}
