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


  constructor(public routes : Router,public Api : ApiService,public toast:ToastrService ,public alertService:AlertService) {
  
   }

  ngOnInit() {
  }
  public onSubmit(form: NgForm) {
   console.log(form.value)
   this.Api.APIlogin(form.value).catch(e =>{
     console.log(e,"error")
   })
  }
}
