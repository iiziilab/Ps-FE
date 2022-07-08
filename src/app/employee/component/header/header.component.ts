import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PsolutionsService } from 'src/app/services/psolutions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  currentUser: User;
  img:string;
  constructor(private router: Router,private services : PsolutionsService,
    private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x); }

    async ngOnInit(): Promise<void> {
      this.authenticationService.profileImageUpdate$.subscribe((profileImage) => this.img = profileImage);
      await this.services.getEmpPicbyId(this.currentUser.data.employeeId).toPromise().then(x=>{
        if(x.statusCode == 200)
        {
          this.img =  'data:image/jpeg;base64,' + x.data.image;
        }else{
          this.img = '/assets/img/profile/profile-11.jpg';
        }
      });
    }
  
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}

