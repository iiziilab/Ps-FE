import { AbstractControl, FormControl } from '@angular/forms';
// export function removeSpaces(control: AbstractControl) {
//   if (control && control.value && !control.value.replace(/\s/g, '').length) {
//     control.setValue('');
//   }
//   return null;
// }

export function noWhitespaceValidator(control: FormControl) {
  const isSpace = (control.value || '').match(/\s/g);
  return isSpace ? {'whitespace': true} : null;
}