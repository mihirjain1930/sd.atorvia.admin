import { FormControl } from '@angular/forms';

export const validateEmail = function(c: FormControl) {
  let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

  return EMAIL_REGEXP.test(c.value) ? null : {
    validateEmail: {
      valid: false
    }
  };
}

export const validatePhoneNum = function(c: FormControl) {
  let REGEXP = /[0-9\(\)\-\.\ \+]{7,20}/;

  return REGEXP.test(c.value) ? null : {
    validatePhoneNum: {
      valid: false
    }
  };
}

export const validateFirstName = function(c: FormControl) {
  let REGEXP = /[a-zA-Z\.]{2,}[a-zA-Z ]{0,30}/;

  return REGEXP.test(c.value) ? null : {
    validateFirstName: {
      valid: false
    }
  };
}