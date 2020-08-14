import AuthRouter from "./AuthRouter";
import PatientRouter from "./PatientRouter";
import CaseRouter from "./CaseRouter";
import UserRouter from "./UserRouter";
import EventsRouter from "./EventsRouter";
import ContactRouter from "./ContactRouter";

export default function (app) {
  app.use(AuthRouter);

  app.use(UserRouter);

  app.use(PatientRouter);

  app.use(CaseRouter);

  app.use(EventsRouter);

  app.use(ContactRouter);
}
