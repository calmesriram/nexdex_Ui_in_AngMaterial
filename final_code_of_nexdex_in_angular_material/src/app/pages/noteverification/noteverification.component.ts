import { Component, OnInit } from '@angular/core';
import { ApiService, AlertService } from 'src/app/shared';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-noteverification',
  templateUrl: './noteverification.component.html',
  styleUrls: ['./noteverification.component.scss']
})
export class NoteVerification implements OnInit {

  public showServerDetails = false;
  public ServerDetails:any = {};
  public BlockChainDetails:any = {};
  public ViewingKeyDetails:any = {};

  constructor(public Api : ApiService,public alertService:AlertService) {
    this.Api.getNodehash("0x2dff1e3b613d2901a1bf7a2e5ae0d8a1c484f146104cbd0e03c4738906ec59ac").then(console.log)
  }

  ngOnInit() {
  }
  
  public onSubmit(form: NgForm) {
    let query  = form.value    
    this.Api.getNodehash(query.notehash).then(res => {
      
      if (Object.keys(res["data"]).length) {
        this.ServerDetails = res["data"];
        this.showServerDetails = true;
        this.Api.get_BlockChain_ACE_data(this.ServerDetails["zkAssetAddress"],this.ServerDetails["note_hash"]).then(bres =>{
          this.BlockChainDetails = bres
        })
        this.Api.get_ViewingKey_data(this.ServerDetails["viewingKey"]).then(v_res =>{
          this.ViewingKeyDetails = { "v_noteHash" : v_res.noteHash,"v_count":v_res.k.toNumber() }
        })
      }
      else {
        this.showServerDetails = false;
        this.alertService.showToaster1("Invalid NoteHash");
      }
    })
    
  }

}