import { Component, OnInit } from '@angular/core';
import { ApiService } from './shared';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  //isLoggedIn:boolean =false;
  constructor(private authservice: ApiService) {
 
  }

  ngOnInit(){
   
  }
  title = 'maticdex';
}
