import moment from "moment";

/**
 *
 * @param {Date|String|Number} date Date source
 */
export function getDate(date, getTime = false, format = "DD MMMM YYYY") {
  var src = new Date(date);
  var diff = dateDiff(src, new Date());

  switch (diff) {
    case 0:
      return getTime ? moment(src).format("LT") : "Today";
    case 1:
      return "Yesterday";
    default:
      return moment(src).format(format);
  }
}

export function dateDiff(d1, d2) {
  var date1 = new Date(new Date(d1).toISOString().slice(0, 10)),
    date2 = new Date(new Date(d2).toISOString().slice(0, 10));

  return (date1 - date2) / 86400000;
}
