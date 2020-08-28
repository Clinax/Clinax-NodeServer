import {
  create500,
  create409,
  create400,
} from "@pranavraut033/js-utils/utils/httpErrors";
import User from "../models/User";

export function createUser(req, res) {
  const user = req.body;

  new User(user)
    .save()
    .then((_user) => res.json(_user.toObject()))
    .catch((err) => {
      if (err.name === "MongoError" && err.code === 11000) {
        create409(
          res,
          `User with ${
            err.message.indexOf("username") !== -1
              ? `username '${user.username}'`
              : `email '${user.email}'`
          } already exists.`,
          err
        );
      } else create500(res, err);
    });
}

export function updateUser(req, res) {
  Object.assign(req.user, req.body.updates);

  req.user
    .save()
    .then((user) => res.json(user))
    .catch((err) =>
      create400(
        res,
        `Failed to update user with id '${req.params.userId}'`,
        err
      )
    );
}

export function deleteUser(req, res) {
  User.deleteOne({ _id: req.parmas.id })
    .then((result) => res.json(result))
    .catch((err) => create500(res, err));
}
