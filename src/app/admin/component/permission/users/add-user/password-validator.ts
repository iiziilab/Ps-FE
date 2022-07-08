import { AbstractControl } from "@angular/forms";

export class ConfirmPasswordValidator {
    static MatchPassword(control: AbstractControl) :any {
       let password = control.get('password').value;

       let confirmpassword = control.get('confirmpassword').value;

        if(password != confirmpassword) {
            control.get('confirmpassword').setErrors( {ConfirmPassword: true} );
        } else {
            return null
        }
    }
}