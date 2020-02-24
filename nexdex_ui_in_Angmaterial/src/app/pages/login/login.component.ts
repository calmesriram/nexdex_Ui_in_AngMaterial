import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RouterModule , Router } from '@angular/router';
import { ApiService, AlertService } from 'src/app/shared';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  constructor(private routes : Router,private Api : ApiService,private toast:ToastrService ,private alertService:AlertService) {
  
   }

  ngOnInit() {
  }
  public onSubmit(form: NgForm) {
   console.log(form.value)
   //this.alertService.showToaster("Thankyou");
   this.Api.APIlogin(form.value).then(res =>{
    console.log(res ,"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    //this.alertService.showToaster(res);
  })
  }
}
