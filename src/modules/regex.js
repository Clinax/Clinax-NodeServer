// eslint-disable-next-line

export const EMAIL_REGEX = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/gm;
// eslint-disable-next-line
export const URL_REGEX = /((https?:\/\/(?:www\.|(?!www)))?[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|(https?:\/\/(?:www\.|(?!www)))?[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gim;

export function stringToRegex(input) {
  input = input && input.trim().replace(/[\[\]\\\^\$\.\|\?\*\+\(\)]/g, "");

  return input && new RegExp(input, "ig");
}
