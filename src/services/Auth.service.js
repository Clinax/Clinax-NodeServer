import jwt from "jsonwebtoken";
import { sha256 } from "js-sha256";
import {
  create400,
  create403,
  create404,
  create498,
  create500,
  create499,
} from "@pranavraut033/js-utils/utils/httpErrors";
import User from "../models/User";
import LoginRecord from "../models/LoginRecord";

require("dotenv").config();

export const self = (req, res) => res.json(req.user.toObject());

export function login(req, res) {
  if (!req.body.username || !req.body.password)
    return create400(res, "Missing username or password");

  User.findOne({ username: req.body.username })
    .select("+password")
    .then((user) => {
      if (!user)
        return create403(
          res,
          `User with username '${req.body.username}' not found`
        );

      if (user.password === sha256(req.body.password))
        return create403(res, "Password or username is incorrect");

      new LoginRecord({
        user: user._id,
        ip: req.clientIp,
        userAgent: req.headers["user-agent"],
      }).save();

      const token = jwt.sign({ id: user._id }, process.env.JWT_SIGNING_KEY, {
        expiresIn: "30 day",
      });

      const userObject = user.toObject();
      delete userObject.password;

      res.json({ token, user: userObject });
    })
    .catch(create500.bind(null, res));
}

export function authenticate(req, res, next) {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) return create499(res, "Missing Token");

  jwt.verify(token, process.env.JWT_SIGNING_KEY, (err, decoded) => {
    if (err) return create498(res, "Verification Failed", err);

    User.findById(decoded.id)
      .then((user) => {
        if (!user) return create404(res, "User is deleted");

        req.user = user;
        next();
      })
      .catch(create500.bind(null, res));
  });
}
