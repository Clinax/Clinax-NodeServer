import { UserModel } from "../models/user";
import { create404, create500, create400 } from "../utils";

import { sha224, sha256 } from "js-sha256";
import { ULHModel } from "../models/userLoginHistory";
import config from "../config";

class TokenExpiredError extends Error {}

export function verifyToken(token, callback, err) {
  ULHModel.findOne(
    {
      token: token
    },
    (error, token) => {
      if (token) {
        const SESSION_VALITY = config.validSessionTTL * 60 * 60;
        let date = new Date();
        let timeElapsed = (date.getTime() - token.timestamp.getTime()) / 100;
        console.log(
          "Sesison about to expire in " +
            (SESSION_VALITY - timeElapsed).toHHMMSS()
        );

        if (timeElapsed <= SESSION_VALITY) callback(token);
        else err(new TokenExpiredError("Token expired"));
      } else err(error);
    }
  ).catch(err);
}

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

export function find(req, res) {
  verifyToken(
    req.params.token,
    token =>
      UserModel.findById(token.userId).then(user => {
        if (!user)
          return create404(
            res,
            `user with id '${req.params.userId}' not found`
          );
        res.json(user.toObject());
      }),
    err => {
      if (err instanceof TokenExpiredError) create400(res, null, err);
      else
        create500(
          res,
          `Failed to retrive user with id '${req.params.userId}'`,
          err
        );
    }
  );
}

// export function findAll(_, response) {
//     UserModel.find()
//         .then(res => response.json(res))
//         .catch(err => create500(res, "Failed to retrive patients details", err));
// }

export function update(req, res) {
  UserModel.findById(req.params.userId, (err, user) => {
    if (err)
      return create404(
        res,
        `Failed to retrive user with id '${req.params.userId}'`
      );

    for (var attr in req.body.updates) user[attr] = req.body.updates[attr];

    user
      .save()
      .then(user => res.json(user))
      .catch(err =>
        create400(
          res,
          `Failed to update user with id '${req.params.userId}'`,
          err
        )
      );
  });
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

  UserModel.find(
    {
      username: req.body.username
    },
    (err, users) => {
      let user = users[0];

      if (err || !user)
        return create404(
          res,
          `User with username '${req.body.username}' not found`
        );

      if (user.password == sha256(req.body.password)) {
        var date = new Date();

        let ulh = new ULHModel({
          userId: user._id,
          userIp: req.clientIp,
          token: sha224(user.password + user.username + date.toString()),
          timestamp: date
        });

        ulh.save().then(token => {
          req.session.token = token;
          if (token)
            res.json({
              token: token.token,
              user
            });
          else create500(res, "Something went wrong");
        });
      } else
        res.json({
          message: "Password is incorrect"
        });
    }
  ).select("+password");
}

const _delete = (req, res) => {
  res.send("not yet inplemeanted");
};

export { _delete as delete };
