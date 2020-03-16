import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-getkeys',
  templateUrl: './getkeys.component.html',
  styleUrls: ['./getkeys.component.scss']
})
export class GetkeysComponent implements OnInit {
  public publickey: any;
  public address: any;
  public zkAssetAddress = [];
  public privatekey: String = "";
  public show: boolean = false;

  constructor(private apiservice: ApiService) { }

  ngOnInit() {
  }

  public onSubmit(form: NgForm) {
    this.apiservice.getpubkeyAndAddress(form.value.privatekey).then(res => {
      this.publickey = res['publickey']
      this.address = res['address']
      form.reset();
    })
    this.showandhide();
  }
  validatePrivateKey() {
    if (this.privatekey.length > 66 || this.privatekey.length == 65 || this.privatekey.length <= 0) {
      return;
    }
    if (this.privatekey.length == 66) {
      this.privatekey = this.privatekey.substring(2, 66)
    }
    if (this.privatekey.length == 64) {
      this.privatekey = this.privatekey;
    }
  }
  showandhide() {
    var pvt = this.privatekey;
    if (pvt.toString().length > 0) {
      this.show = true;
    } else {
      this.show = false;
    }
  }
}
