import { Component, OnInit } from '@angular/core';
import { ApiService } from './shared';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  //isLoggedIn:boolean =false;
  public connectioninfo: String;
  public conninfohideShow: Boolean;
  constructor(public authservice: ApiService) {

  }

  ngOnInit() {
    this.checkstatus();
    // window.onbeforeunload = function () {
    //   console.log('Are you really want to perform the action?');
    //  }
  }
  checkstatus() {
    // this.connectioninfo="";
    this.authservice.CheckApiServer().then(res => {
      if (res["message"]) {
        this.conninfohideShow = true;
        this.connectioninfo = res["message"];
      }
      if (res["message"] == "Hello World") {
        this.conninfohideShow = false;
      }

    }).catch(e => {
      console.log(e, "Err msg");
      return;
    }).finally(() => {
      setTimeout(() => {
        this.checkstatus();
      }, 15000);
    })
  }

  title = 'maticdex';
}
