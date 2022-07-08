import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './model/user.model';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
   templateUrl: './app.component.html',
  // template:`
  //   <router-outlet></router-outlet>
  // `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title:'PS';
  currentUser: User;
  
  constructor(
      private router: Router,
      private authenticationService: AuthenticationService) {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  logout() {
      this.authenticationService.logout();
      this.router.navigate(['/login']);
  }
}
