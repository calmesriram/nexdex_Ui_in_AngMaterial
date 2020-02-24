import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService, AlertService } from 'src/app/shared';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatStepper } from '@angular/material';
import { JoinsplitTransferComponent } from '../joinsplit_transfer/joinsplit_transfer.component';
import { JoinsplitapproveComponent } from '../joinsplit_approve/joinsplit_approve.component';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { log } from 'util';
import { async } from 'rxjs/internal/scheduler/async';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-notehash',
  templateUrl: './joinsplit.component.html',
  styleUrls: ['./joinsplit.component.scss']
})
export class JoinsplitComponent implements OnInit {
  public userAddress = {}
  public user_balance = {}
  public account: any = {};
  public zkAssetAddress_obj = {};
  public show: boolean = false;
  public explorer_url = "";
  public loader: boolean;
  public privatekeydetails: any;
  public stepper: any;
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  public alladdress_user: any = [];
  detbool: boolean = false;
  // @ViewChild('stepper',any) stepper: MatStepper;


  constructor(public _snackBar: MatSnackBar, public Api: ApiService, public Router: Router, public toast: ToastrService, public alertService: AlertService, public dialog: MatDialog, public _formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      privateKey: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      to_publicKey: ['', Validators.required],
      zkAssetAddress: ['', Validators.required],
      count: ['', Validators.required],
    });
    this.getalladdress();
  }
  getalladdress() {
    this.Api.getAlladdress_user().then(res => {
      console.log(res, "all address user")
      if (res.status == true) {
        this.alladdress_user = res.data
      }
    })
  }

  async privatekeyvalidation() {
    let temp_privatekey;
    let resadd = "";
    var status = false;
    this.detbool = false;
    if (this.privatekeydetails.length > 66 || this.privatekeydetails.length < 64 || this.privatekeydetails.length == 65 || this.privatekeydetails.length <= 0 || this.privatekeydetails == "") {
      this.detbool = false;
      return;
    }

    // console.log((this.privatekeydetails).substring(2,66))
    if (this.privatekeydetails.length == 66) {
      temp_privatekey = (this.privatekeydetails).substring(2, 66)
    }
    if (this.privatekeydetails.length == 64) {
      temp_privatekey = this.privatekeydetails
    }
    // console.log(this.alladdress_user)
    this.Api.getpubkeyAndAddress(temp_privatekey).then(res => {
      resadd = res["address"];
      // console.log(res)    
    }).then(() => {
      this.alladdress_user.forEach(async address_items => {
        if (resadd == address_items.address) {
          status = true;
          this.detbool = true;
        }
      })
    })
      .finally(() => {
        if (status == true) {
          this.detbool = true;
        } else {
          this.detbool = false;
          this._snackBar.open("Invalid Private key", "close", {
            duration: 5000,
          });
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
    let payload = { "to_publicKey": formData.to_publicKey, "zkAssetAddress": formData.zkAssetAddress, "count": formData.count, "account": this.account }
    // console.log(payload,"payload")
    // return;
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

  }

}