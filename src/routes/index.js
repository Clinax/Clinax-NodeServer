import AuthRouter from "./AuthRouter";
import PatientRouter from "./PatientRouter";
import CaseRouter from "./CaseRouter";
import UserRouter from "./UserRouter";
import EventsRouter from "./EventsRouter";

export default function (app) {
  app.use(AuthRouter);

  app.use(UserRouter);

  app.use(PatientRouter);

  app.use(CaseRouter);

  app.use(EventsRouter);
}
