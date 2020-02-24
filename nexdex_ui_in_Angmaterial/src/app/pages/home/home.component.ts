import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styles: [`
  #content {
    padding: 20px;
  }
`]
})

export class HomeComponent {

  public onToTop(): void {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

}
