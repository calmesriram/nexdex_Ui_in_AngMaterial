import { Component,OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/shared/services/api.service';
@Component({
  selector: 'app-getkeys',
  templateUrl: './getkeys.component.html',
  styleUrls: ['./getkeys.component.scss']
})
export class GetkeysComponent implements OnInit {
public publickey:any;
public address:any;
//privatekey: any = "0x81ED94E347EAA804802C716AAB5D00FEB343ED4BA7D8149B6349AC0D3C41F6DC";    
public privatekey: any;
public show: boolean =false;

  constructor(private apiservice : ApiService) { }

  ngOnInit() {
   
  }
  public onSubmit(form: NgForm) {
 
    console.log(form.value.privatekey)
    //this.apiservice.getAddress("0x81ED94E347EAA804802C716AAB5D00FEB343ED4BA7D8149B6349AC0D3C41F6DC");    
    //this.apiservice.getAddress1(form.value.privatekey);
    // this.apiservice.getAddress1(form.value.privatekey).then(res=>{
    //   console.log("publickey:"+res[0]);
    //   this.publickey=res[0];
    //   console.log("addreess:"+res[1]);
    //   this.address=res[1];
    // })
    this.showandhide();
    
   }
   public onSub(form: NgForm) {
 
    console.log(form.value.name)
;
   }
   showandhide()
   {
    var pvt=this.privatekey;
    if (pvt.toString().length>0) {
      this.show = true;
    } else {
      this.show= false;
    }
   }
}
