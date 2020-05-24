Date.prototype.addDays = function (days) {
  this.setDate(this.getDate() + parseInt(days));
  return this;
};

Number.prototype.toHHMMSS = function () {
  var sec_num = parseInt(this.toFixed(0), 10); // don't forget the second param
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - hours * 3600) / 60);
  var seconds = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;

  return hours + ":" + minutes + ":" + seconds;
};

/**
 * return the length of a number ex.  4163 => 4, 51 => 2
 */
Number.prototype.length = function () {
  (1 + Math.log10(Math.abs(this) + 1)) | 0;
};
