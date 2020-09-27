import { create500 } from "@pranavraut033/js-utils/utils/httpErrors";
import InventoryTodo from "../models/InventoryTodo";

export async function addOrUpdateInventoryToDoEntry(req, res) {
  let entry = await InventoryTodo.findOne({
    user: req.user._id,
    name: req.body.name,
  });

  if (entry) Object.assign(entry, req.body);
  else
    entry = new InventoryTodo({
      user: req.user._id,
      ...req.body,
    });

  entry
    .save()
    .then((_entry) => res.json(_entry.toObject()))
    .catch(create500.bind(null, res));
}

export function getAll(req, res) {
  InventoryTodo.find({
    user: req.user._id,
  })
    .then((results) => res.json(results.map((e) => e.toObject())))
    .catch(create500.bind(null, res));
}

export function deleteInventoryToDoEntry(req, res) {
  InventoryTodo.deleteOne({
    user: req.user._id,
    name: req.params.name,
  })
    .then((result) => res.json(result))
    .catch(create500.bind(null, res));
}
