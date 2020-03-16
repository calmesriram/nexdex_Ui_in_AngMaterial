import { Component, OnInit, Inject,DoCheck, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { ApiService, AlertService } from 'src/app/shared';

var clear;

@Component({
  selector: 'app-joinsplit_approve',
  templateUrl: './joinsplit_approve.component.html',
  styleUrls: ['./joinsplit_approve.component.scss']
})
export class JoinsplitapproveComponent implements OnInit, OnDestroy {

  wasFormChanged = false;
  public loader: boolean;
  public balance = {};  
  privatekey:any="";
  btndisable:boolean;
  constructor(private fb: FormBuilder, public alertService: AlertService, private Api: ApiService) {
    this.get_balance()
  }
  ngOnInit() {  
    clear = setInterval(() => { console.log(this.balance); this.get_balance(); }, 10000);
  }
  ngOnDestroy() {
    clearInterval(clear);
  }
  validatePrivateKey() {
    console.log(this.privatekey)
    console.log(this.privatekey.length)
    if (this.privatekey.length > 66 || this.privatekey.length < 64 || this.privatekey.length == 65 || this.privatekey.length <= 0 || this.privatekey == "") {
      this.btndisable = false;
      return;
    }
    if (this.privatekey.length == 66) {
      this.privatekey = this.privatekey.substring(2, 66)
      this.btndisable = true;
    }
    if (this.privatekey.length == 64) {
      this.privatekey = this.privatekey;
      this.btndisable = true;
    }
  }
  async get_balance() {
    let balObj = {};
    let loop = 0;
    console.log("called")
    this.Api.getAlladdress_user().then(async (res) => {
      res["data"].forEach(async user_addr => {
        this.Api.getPerticularAddress_data(user_addr["address"]).then(async (user_data) => {
          user_data["data"].forEach(async notedata => {
            loop++;
            console.log("looper on")
            if (notedata["status"] == 4) {
              if (notedata["zkAssetAddress"] in balObj) {
                // this.balance[notedata["zkAssetAddress"]]["count"] += notedata["count"]
                balObj[notedata["zkAssetAddress"]]["count"] += notedata["count"];
                // this.balance[notedata["zkAssetAddress"]]["count"] += notedata["count"]
              } else {
                balObj[notedata["zkAssetAddress"]] = { "pending_count": 0, "count": notedata["count"], "symbol": user_data["total_balance"][notedata["zkAssetAddress"]]["symbol"] }
                // this.balance[notedata["zkAssetAddress"]] = { "pending_count": 0, "count": notedata["count"], "symbol": user_data["total_balance"][notedata["zkAssetAddress"]]["symbol"] }
              }
            } else if (notedata["status"] == 3) {
              if (notedata["zkAssetAddress"] in balObj) {
                balObj[notedata["zkAssetAddress"]]["pending_count"] += notedata["count"]
                // this.balance[notedata["zkAssetAddress"]]["pending_count"] += notedata["count"]
              } else {
                balObj[notedata["zkAssetAddress"]] = { "count": 0, "pending_count": notedata["count"], "symbol": user_data["total_balance"][notedata["zkAssetAddress"]]["symbol"] }
                // this.balance[notedata["zkAssetAddress"]] = { "count": 0, "pending_count": notedata["count"], "symbol": user_data["total_balance"][notedata["zkAssetAddress"]]["symbol"] }
              }
            }
            if(res["data"].length*user_data["data"].length == loop)
            {
              // setTimeout(()=>{
                let balObjKeys = Object.keys(balObj);
                balObjKeys.forEach((_objKey)=>{
                  if(this.balance[_objKey] == undefined){
                    this.balance[_objKey] = {
                        pending_count:0,
                        count:0,
                        symbol:""
                    }
                  }
                  console.log("objkey store ",this.balance)
                  // else if(balObjKeys[_objKey]["pending_count"]){

                  // }
                  if(balObj[_objKey]["pending_count"] != this.balance[_objKey]["pending_count"]){
                    this.balance[_objKey]["pending_count"] = balObj[_objKey]["pending_count"];
                  }
                  if(balObj[_objKey]["count"] != this.balance[_objKey]["count"]){
                    this.balance[_objKey]["count"] = balObj[_objKey]["count"];
                  }
                  if(balObj[_objKey]["symbol"] != this.balance[_objKey]["symbol"]){
                    this.balance[_objKey]["symbol"] = balObj[_objKey]["symbol"];
                  }
                })
              // },3000)
            }
          });
        });
      });
    })
  }

  public onSubmit(form: NgForm) {
    this.loader = true;
    let privateKey = form.value.privateKey
    if (privateKey.slice(0, 2) == '0x') {
      privateKey = privateKey.slice(2, 66)
    }

    this.Api.getpubkeyAndAddress(privateKey).then(res => {

      this.Api.getPerticularAddress_data(res['address']).then(user_data => {
        console.log(user_data, "USER PERticular address")
        user_data["data"].forEach(async notedata => {
          if (notedata["status"] == 3) {
            notedata["User_privateKey"] = privateKey
            this.Api.notespending(notedata).then(res => {
              if (res.status == true) {
              }
              if (res.status == false) {

              }
            })

          }
        })
      }).then(x => {
        this.loader = false;
        this.alertService.showToaster("Done !!!");
      })
    })
  }
}
