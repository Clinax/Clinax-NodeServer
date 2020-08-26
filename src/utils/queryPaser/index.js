import querystring from "querystring";

export default function (req, _, next) {
  const i = req.url.indexOf("?");
  const a = {};
  if (i != -1) {
    const parameters = querystring.parse(req.url.slice(i + 1));
    for (const key in parameters) a[key] = parameters[key];
  }
  req.queryParams = Object.freeze(a);
  next();
}
