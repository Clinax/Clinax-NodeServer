import {
    UserModel
} from "../models/user";

export function create(req, res) {
    if (!req.body.user)
        return create400(res, "user attributes was not provided");

    var user = new UserModel(req.body.user)

    user.validate(err => {
        if (!err)
            user.save()
            .then(data => res.json(data))
            .catch(err => create500(res, err.message))
        else create400(res, err.message)
    })
}

export function find(req, res) {
    UserModel.findById(req.params.userId)
        .then(user => {
            if (!user) return create404(res, `user with id '${req.params.userId}' not found`);
            res.json(user);
        }).catch(err => create500(res, `Failed to retrive user with id '${req.params.userId}'`, err));
}

export function update(req, res) {
    UserModel.findById(req.params.userId, (err, user) => {
        if (err)
            return create404(res, `Failed to retrive user with id '${req.params.userId}'`);

        for (var attr in req.body.updates)
            user[attr] = req.body.updates[attr];

        user.save()
            .then(user => res.json(user))
            .catch(err => Utils.create400(res, `Failed to update user with id '${req.params.userId}'`, err));
    })
}

export function login(req, res) {
    res.send("not yet inplemeanted");
}

const _delete = (req, res) => {
    res.send("not yet inplemeanted");
};

export {
    _delete as delete
};