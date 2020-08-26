import AuthRouter from "./Auth.router";
import PatientRouter from "./Patient.router";
import CaseRouter from "./Case.router";
import UserRouter from "./User.router";
import EventsRouter from "./Events.router";
import ContactRouter from "./Contact.router";

export default function (app) {
  app.use(AuthRouter);

  app.use(UserRouter);

  app.use(PatientRouter);

  app.use(CaseRouter);

  app.use(EventsRouter);

  app.use(ContactRouter);
}
