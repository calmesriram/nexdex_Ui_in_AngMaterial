import { Component,OnDestroy, ElementRef, HostListener } from '@angular/core';
import { ApiService, AlertService } from '../../services';
import { RouterModule , Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  //public isAuthenticated: string;
  public sidenav;
  public user:string="";
  public angularImage: string = '/assets/img/wandx2.png';
  public isNavClose:boolean = true;
  isOpen:boolean = false;
  @HostListener('document:click', ['$event'])
  clickout(event) {
    if(this.eRef.nativeElement.contains(event.target)) {
      // console.log("clicked inside")
    } else {      
      this.isOpen = false;
      // console.log("clicked outside")

    }
  }
  constructor(public authService: ApiService,private alertService: AlertService,private routes:Router,private eRef: ElementRef)
  {
    this.getName();
  }
  getName(){
      this.user = atob(sessionStorage.getItem('user'));
  }
  onLogout()
  {
      this.authService.logout();     
  }
//   myclose(event){
//     console.log(event)
//     event.target.hidden= true
//   }
// ngOnDestroy(){
//   this.sidenav.close()
// }
  
}
