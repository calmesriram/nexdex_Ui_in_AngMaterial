import { Component } from '@angular/core';
import { ApiService, AlertService } from 'src/app/shared';
import { Router } from '@angular/router';

@Component({
  template: `
    <div id="content">
      <mat-card>
          <h1>Page not found 404</h1>
            The page you're looking for doesn't exist, please return to the <a routerLink="/login">homepage</a>.(or)<br>
            The page will redirected automatically <span style="color:red">{{redirect_count}}</span><small>s</small>.
      </mat-card>
   </div>
`,
  styles: ['#content { padding: 20px;}']
})

export class PageNotFoundComponent {
  redirect_count: any = 10;
  constructor(public api: ApiService, public Router: Router) {
    this.api.menuhide = true;
    var clear_interval = setInterval(() => {
      this.redirect_count = this.redirect_count - 1;
      if (this.redirect_count == 0) {
        clearInterval(clear_interval);
        this.Router.navigateByUrl("/login");
        return;
      }      
    }, 1000)
  }
}
