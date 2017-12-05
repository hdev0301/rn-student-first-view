import {forIn, isFunction, isEmpty} from 'lodash';

export const validate = (form = {}, constrains = {}) => {
  let errors = {};
  forIn(form, function(value, key) {
    const constrain = constrains[key];
    if (isFunction(constrain)) {
      const error = constrain(value, form);
      if (error) {
        errors[key] = error;
      }
    }
  });
  return isEmpty(errors) ? null : errors;
};
