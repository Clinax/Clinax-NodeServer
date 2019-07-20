import { UserModel } from "../models/user";
import { create404, create500, create400 } from "../utils";

import { sha256 } from "js-sha256";
import { ULHModel } from "../models/userLoginHistory";
import jwt from "jsonwebtoken";
import { createPrivateKey } from "crypto";

export function create(req, res) {
  if (!req.body.user) return create400(res, "user attributes was not provided");

  var user = new UserModel(req.body.user);
  user.validate(err => {
    if (!err)
      user
        .save()
        .then(data => res.json(data))
        .catch(err => {
          if (err.name == "MongoError" && err.code == 11000) {
            create400(
              res,
              "User with " +
                (err.message.indexOf("username") != -1
                  ? `username '${user.username}'`
                  : `email '${user.email}'`) +
                " already exists.",
              err
            );
          } else create500(res, err.message);
        });
    else create400(res, err.message);
  });
}

export const find = (req, res) => res.json(req.user.toObject());

// export function findAll(_, response) {
//     UserModel.find()
//         .then(res => response.json(res))
//         .catch(err => create500(res, "Failed to retrive patients details", err));
// }

export function update(req, res) {
  for (var attr in req.body.updates) req.user[attr] = req.body.updates[attr];

  req.user
    .save()
    .then(user => res.json(user))
    .catch(err =>
      create400(
        res,
        `Failed to update user with id '${req.params.userId}'`,
        err
      )
    );
}

export function logout(req, res) {
  ULHModel.find(
    {
      token: req.params.token
    },
    (err, tokens) => {
      let token = tokens[0];
      if (token) {
        ULHModel.deleteMany(
          {
            userId: token.id
          },
          (err, response) => {
            if (!err)
              res.json({
                status: "ok",
                res: response
              });
            else create400(res, null, err);
          }
        );
      } else create404(res, "Failed to access token", err);
    }
  ).catch(err =>
    create500(res, `Failed to retrive user with id '${req.params.userId}'`, err)
  );
}

export function login(req, res) {
  if (!req.body.username || !req.body.password)
    return create400(res, "Missing username or password");

  UserModel.findOne({ username: req.body.username }, (err, user) => {
    if (err || !user)
      return create404(
        res,
        `User with username '${req.body.username}' not found`
      );

    if (user.password == sha256(req.body.password)) {
      var date = new Date();

      new ULHModel({
        userId: user._id,
        userIp: req.clientIp,
        timestamp: date
      }).save();

      let token = jwt.sign({ id: user._id }, publicKey, {
        expiresIn: "15 day"
      });

      let _user = user.toObject();
      delete _user.password;

      res.json({
        token: token,
        user: _user
      });
    } else res.json({ message: "Password is incorrect" });
  }).select("+password");
}

const _delete = (req, res) => {
  res.send("not yet inplemeanted");
};

export { _delete as delete };
