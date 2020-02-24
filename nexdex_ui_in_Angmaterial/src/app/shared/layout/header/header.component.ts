import { Component } from '@angular/core';
import { ApiService, AlertService } from '../../services';
import { RouterModule , Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  //public isAuthenticated: string;
  public angularImage: string = '/assets/img/wandx2.png';
  constructor(public authService: ApiService,private alertService: AlertService,private routes:Router)
  {

  }
  onLogout()
  {
      this.authService.logout();     
  }
  
}
