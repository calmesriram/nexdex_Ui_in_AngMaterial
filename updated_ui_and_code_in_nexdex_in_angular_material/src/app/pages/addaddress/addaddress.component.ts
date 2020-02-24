import { Component, OnInit } from '@angular/core';
import { ApiService, AlertService } from 'src/app/shared';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-addaddress',
  templateUrl: './addaddress.component.html',
  styleUrls: ['./addaddress.component.scss']
  
})
export class AddaddressComponent implements OnInit {  
  public validate_privatekey: String = "";
  public loader: boolean;
  public alladdress_user: any = [];
  public listaddress: any = [];
  public listaddress_headers: any = [];
  public alladdress_length: number = 0;
  constructor(private Api: ApiService, private toast: ToastrService, private alertService: AlertService, private dialog: MatDialog) { }

  ngOnInit() {         
    this.getAlladdressUser();
    setInterval(() => {
      this.getAlladdressUser1();
    }, 10000)
  }
 
  getAlladdressUser() {
    this.alladdress_length = 0;
    this.Api.getAlladdress_user().then(res => {
      if (res.status == true) {        
        this.alladdress_user = res.data
      }
    }).then(() => {
      this.alladdress_length = this.alladdress_user.length;
      this.listAddressandBal()
    }).catch(e => {
      console.log(e);
      return;
    })
  }

  getAlladdressUser1() {
    this.Api.getAlladdress_user().then(res => {
      if (res.status == true) {
        this.alladdress_user = res.data
      }
    }).then(() => {
      if (this.alladdress_length < this.alladdress_user.length) {
        this.alladdress_length = this.alladdress_user.length;
        this.listAddressandBal()
      }
    }).catch(e => {
      console.log(e);
      return;
    })
  }

  async listAddressandBal() {

    this.listaddress_headers.length = 0;
    try {

      if (this.listaddress.length == 0) {
        this.alladdress_user.forEach(async (items, ind) => {
          await this.Api.getPerticularAddress_data(items.address).then(res => {
            this.listaddress.push({
              "address": items.address,
              "totalbalance": res.total_balance
            });
          })
        })
      }
      else {
        await this.Api.getPerticularAddress_data(this.alladdress_user[(this.alladdress_user.length - 1)].address).then(res => {
          this.listaddress.push({
            "address": this.alladdress_user[(this.alladdress_user.length - 1)].address,
            "totalbalance": res.total_balance
          });
        })
      }
    } catch (e) {
      console.log(e)
      return;
    } finally {
      let a = [];
      setTimeout(() => {
        this.listaddress.filter(i => {
          a.push(Object.values(i.totalbalance))
        })
        a.forEach(i => {
          for (let a = 0; a < i.length; a++) {
            this.listaddress_headers.push(i[a].symbol);
          }
        })
        let unique = this.listaddress_headers.filter((item, i, ar) => ar.indexOf(item) === i);
        this.listaddress_headers.length = 0;
        for (let i = 0; i < unique.length; i++) {
          this.listaddress_headers.push(unique[i])
        }
        this.listaddress_headers.sort();
      }, 1000);


    }
  }
  singature(a: NgForm) {
    this.loader = true;
    this.Api.ecverify(a).then(res => {
      console.log(res)
      if (res.status == true) {
        this.loader = false;
        this.alertService.showToaster(res.data)
      }
      if (res.status == false) {
        this.loader = false;
        this.alertService.showToaster1(res.data)
      }
      // a.resetForm();
    }).catch((e) => {
      this.loader = false;
      this.alertService.showToaster1(e)
      // a.resetForm();
    })
  }
  validatePrivateKey() {
    console.log(this.validate_privatekey, "privatekey")
    if (this.validate_privatekey.length > 66 || this.validate_privatekey.length == 65 || this.validate_privatekey.length <= 0) {
      return;
    }
    if (this.validate_privatekey.length == 66) {
      this.validate_privatekey = this.validate_privatekey.substring(2, 66)
    }
    if (this.validate_privatekey.length == 64) {
      this.validate_privatekey = this.validate_privatekey;
    }
    // this.validatePrivateKey=null
  }

  

}
