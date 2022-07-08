import { Component, OnInit,Input, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ImageserviceService } from 'src/app/services/imageservice.service';
import { PsolutionsService } from 'src/app/services/psolutions.service';
import { environment } from "src/environments/environment";
import { AdminInfoComponent } from '../profile/admin-info/admin-info.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})

export class HeaderComponent implements OnInit {

  @Input() image:any;
  currentUser: User;
  user : string;
  img:string;
  name: string = '';
  constructor(private router: Router,private services : PsolutionsService,
    private authenticationService: AuthenticationService,
    private imageservice : ImageserviceService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
   }
  
  async ngOnInit(): Promise<void> {
    this.authenticationService.profileImageUpdate$.subscribe((profileImage) => this.img = profileImage);
    this.user = this.currentUser.data.role.roleName;
    await this.services.getUserInfoPicbyId(this.currentUser.data.id).toPromise().then(x=>{
      if(x.statusCode == 200)
      {
        this.img = 'data:image/jpeg;base64,'+ x.data.image;
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
