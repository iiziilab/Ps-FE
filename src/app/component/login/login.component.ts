import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { User } from 'src/app/model/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PsolutionsService } from 'src/app/services/psolutions.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    error = '';

    constructor(private formBuilder: FormBuilder,private route: ActivatedRoute,
        private router: Router,private authenticationService: AuthenticationService) { 
            localStorage.removeItem('acorn-standard-color');
    }

    async ngOnInit() : Promise<void> {
       
        localStorage.setItem('acorn-standard-color','light-red');
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) { 
            
            if(this.authenticationService.currentUserValue.data.role.roleName ==="client"){
                this.router.navigate(['client/dashboard']);
            }
            else if(this.authenticationService.currentUserValue.data.role.roleName ==="employee"){
                this.router.navigate(['employee/dashboard']);
            }
            else{
                this.router.navigate(['admin/dashboard']);
            }
        }
        this.loginForm = this.formBuilder.group({
            email: ['admin@gmail.com', Validators.required],
            password: ['666666', Validators.required]
        });
        //localStorage.removeItem('currentUser');
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.f.email.value, this.f.password.value)
            .pipe(first())
            .subscribe({
                next: (x) => {
                // get return url from route parameters or default to '/'
                //const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                //this.router.navigate([returnUrl]);
                this.loading = false;
                if(this.authenticationService.currentUserValue != null && x != undefined){
                    if(this.authenticationService.currentUserValue.data.role.roleName === "client"){
                        this.router.navigate(['client/dashboard']);
                    }
                    else if(this.authenticationService.currentUserValue.data.role.roleName === "employee"){
                        this.router.navigate(['employee/dashboard']);
                    }
                    else{
                        if(this.authenticationService.currentUserValue.data.statusId == "1"){
                            this.router.navigate(['admin/dashboard']);
                        }else{
                            this.router.navigate(['/']);
                            this.error = this.authenticationService.currentUserValue.message;
                            this.authenticationService.logout();
                        }
                    }
                }
                else{
                    this.router.navigate(['/']);
                    //this.error = this.authenticationService.currentUserValue.message;
                    this.error = "Invalid Email/Password, Please enter correct email/password"
                }
            },
            error: error => {
                console.log(error);
                this.error = error;
                //this.loading = false;
            }
        });
    }
}
