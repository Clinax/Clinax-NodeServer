export const PHONE_REGEX = /^(?:([+][1-9][0-9]{1,2}\s|))([789][0-9]{9})$/gm;
export const EMAIL_REGEX = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/gm;

export function checkPhone(v) {
    return PHONE_REGEX.test(v);
}

export function checkEmail(v) {
    return EMAIL_REGEX.test(v);
}