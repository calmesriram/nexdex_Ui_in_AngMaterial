import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RouterModule , Router } from '@angular/router';
import { ApiService } from 'src/app/shared';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(private routes : Router,private Api : ApiService) {
  
  }

  ngOnInit() {
  }
  public onSubmit(form:NgForm)
  {
  console.log(form.value);
  this.Api.reg(form.value).then(res =>{
    console.log(res)
  })
  
  }
}
