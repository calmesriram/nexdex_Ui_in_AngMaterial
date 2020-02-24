import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
// import { ApiService,AlertService } from 'src/app/shared/services/api.service';
import { ApiService, AlertService } from 'src/app/shared';
import { from } from 'rxjs';
import { resetFakeAsyncZone } from '@angular/core/testing';

@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.scss']
})
export class MintComponent implements OnInit {
  public publickey: any;
  public address: any;
  public zkAssetAddress = [];  
  public loaderformint: boolean;
  constructor(private apiservice: ApiService,public AlertService:AlertService) { }

  ngOnInit() {    
    this.apiservice.getAddress().then(res => {
      console.log(res);
      if(res.status == true){      
        this.zkAssetAddress = res.data
      }    
    })
  }

  public mint(form: NgForm) {
    this.loaderformint = true;
    this.apiservice.mint_note(form).then(res =>{
      console.log(res)
      if(res["status"]==false){
        this.AlertService.showToaster1(res["data"]);
        this.loaderformint = false;
      }

      if(res["status"]==true){
        this.loaderformint = false;
        this.AlertService.showToaster(res['data'])
        setTimeout(()=>{
          this.AlertService.showToaster(res['tx_id'])          
        },2000)        
      }
    }).catch(e =>{
      this.loaderformint = false;
      console.log(e)
      this.AlertService.showToaster1(e);
    })
  } 
  
}
