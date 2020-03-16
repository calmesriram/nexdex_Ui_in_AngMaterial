import { Component, OnInit, Inject } from '@angular/core';
import { ApiService, AlertService } from 'src/app/shared';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatStepper } from '@angular/material';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
@Component({
  selector: 'app-dialogtrade',
  templateUrl: './dialogtrade.component.html',
  styleUrls: ['./dialogtrade.component.scss']
})
export class DialogtradeComponent implements OnInit {
  public userAddress = {}
  public user_balance = {}
  public account:any = {};
  public zkAssetAddress_obj = {};
  public show: boolean = false;
  public explorer_url = "";
  public loader: boolean;
  public to_publicKey:any;
  public stepper: any;
  public privatekeydetails:any;
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  public alladdress_user:any=[];
  detbool;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public _snackBar:MatSnackBar,public Api: ApiService, public Router: Router, public toast: ToastrService, public alertService: AlertService, private dialog: MatDialog, public _formBuilder: FormBuilder) {
    console.log(data);
  }

  ngOnInit() {
    // this.getescrowAccount();
    this.firstFormGroup = this._formBuilder.group({
      privateKey: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      // to_publicKey: ['', Validators.required],
      zkAssetAddress: ['', Validators.required],
      count: ['', Validators.required],
    });
    this.getalladdress();
  }
getalladdress(){
  this.Api.getAlladdress_user().then(res => {
    console.log(res, "all address user")
    if (res.status == true) {
      this.alladdress_user = res.data
    }
  })
}

  async get_balance(address) {
    let balance = {}
    this.Api.getPerticularAddress_data(address).then(user_data => {
      user_data["data"].forEach(async notedata => {
        if (notedata["status"] == 4) {
          if (notedata["zkAssetAddress"] in balance) {
            balance[notedata["zkAssetAddress"]]["count"] += notedata["count"]
          } else {
            balance[notedata["zkAssetAddress"]] = { "pending_count": 0, "count": notedata["count"], "symbol": user_data["total_balance"][notedata["zkAssetAddress"]]["symbol"] }
          }
        } else if (notedata["status"] == 3) {
          if (notedata["zkAssetAddress"] in balance) {
            balance[notedata["zkAssetAddress"]]["pending_count"] += notedata["count"]
          } else {
            balance[notedata["zkAssetAddress"]] = { "count": 0, "pending_count": notedata["count"], "symbol": user_data["total_balance"][notedata["zkAssetAddress"]]["symbol"] }
          }
        }
      });
    })
    return balance;
  }

  public onSubmit(firstFormGroup, stepper: MatStepper) {

    let meta = this;
    let privateKey = firstFormGroup.value.privateKey;
    if (privateKey.slice(0, 2) == '0x') {
      privateKey = privateKey.slice(2, 66)
    }

    this.Api.getpubkeyAndAddress(privateKey).then(res => {
      meta.account = res;

      meta.get_balance(res['address']).then(bal => {
        // console.log("res", res)
        meta.user_balance = bal
        stepper.next()
      })
    })
  }

  public onSubmitTx(thirdFormGroup, stepper: MatStepper) {
    this.loader = true;
    let formData = thirdFormGroup.value
    this.Api.escrowAccount().then(escrow => {
      if (escrow.data.length >0) {
        let payload = {}
        if (this.data.orderbook_deposit)
         {
            payload = { "to_publicKey": escrow.data[0].publicKey, "zkAssetAddress": formData.zkAssetAddress, "count": formData.count, "account": this.account ,"orderbook_deposit":true}
         } else if (this.data.orderbook_withdraw) {
          payload = { "to_publicKey": this.data.data.user_publicKey, "zkAssetAddress": {"key":this.data.data.zkAssetAddress}, "count": this.data.data.amount, "account": this.account ,"orderbook_withdraw":true}
         }
        console.log(payload,"payload")
        this.Api.joinsplit(payload).then(res => {
         this.loader = false;
         if (res) {
           if (res["status"]) {
             this.explorer_url = this.Api.explorer_url + res.data
             stepper.next()
            } else {
              this.alertService.showToaster1("Transaction Failed Try Again");
            }
          }
        })
      } else {
        alert("Escrow error")
      }
    })
  }


  
  // public onSubmitTx(thirdFormGroup, stepper: MatStepper) {
  //   this.loader = true;
  //   let formData = thirdFormGroup.value
  //   let payload = { "to_publicKey": this.to_publicKey, "zkAssetAddress": formData.zkAssetAddress, "count": formData.count, "account": this.account ,"orderbook_deposit":true}
  //   console.log(payload,"payload")
  //   return;
  //   this.Api.joinsplit(payload).then(res => {
  //     this.loader = false;
  //     if (res) {
  //       if (res["status"]) {
  //         this.explorer_url = this.Api.explorer_url + res.data
  //         stepper.next()
  //       } else {
  //         this.alertService.showToaster1("Transaction Failed Try Again");
  //       }
  //     }
  //   })
  // }

  privatekeyvalidation(){
    let temp_privatekey;
    var status= false;
    let resadd="";
    // console.log((this.privatekeydetails).substring(2,66))
    if(this.privatekeydetails.length == 66){
      temp_privatekey = (this.privatekeydetails).substring(2,66)
    }
    if(this.privatekeydetails.length == 64){
      temp_privatekey = this.privatekeydetails
    }
    // console.log(this.alladdress_user)
    this.Api.getpubkeyAndAddress(temp_privatekey).then(res => {      
      resadd = res["address"];
    }).then(()=>{
      // console.log(resadd,this.alladdress_user);
      for(var i=0;i<this.alladdress_user.length;i++){        
        if(resadd == this.alladdress_user[i]["address"]){
          status = true;          
          return;
        }else{          
          status = false;
          return;
        }
      }
    }).finally(()=>{
      console.log(status)
      if(status == true){
        this.detbool = true;
      }else{
        this.detbool = false;
        this._snackBar.open("Invalid Private key", "close", {
          duration: 5000,
        });
      }
    }) 
  }

}
