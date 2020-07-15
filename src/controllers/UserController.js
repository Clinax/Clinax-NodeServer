import User from "../models/User";

import { create500, create409, create400 } from "../utils/httpErrors";

export function create(req, res) {
  let user = req.body;

  new User(user)
    .save()
    .then((user) => res.json(user.toObject()))
    .catch((err) => {
      if (err.name == "MongoError" && err.code == 11000) {
        create409(
          res,
          "User with " +
            (err.message.indexOf("username") != -1
              ? `username '${user.username}'`
              : `email '${user.email}'`) +
            " already exists.",
          err
        );
      } else create500(res, err);
    });
}

export function update(req, res) {
  for (var attr in req.body.updates) req.user[attr] = req.body.updates[attr];

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

function _delete(req, res) {
  User.deleteOne({ _id: req.parmas.id })
    .then((result) => res.json(result))
    .catch((err) => create500(res, err));
}

export { _delete as delete };
