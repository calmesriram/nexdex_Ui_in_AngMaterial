import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotehashdialogdeleteComponent } from '../notehashdialogdelete/notehashdialogdelete.component';
import { ApiService,AlertService } from 'src/app/shared';

@Component({
  selector: 'app-notehashdialog',
  templateUrl: './notehashdialog.component.html',
  styleUrls: ['./notehashdialog.component.scss']
})
export class NotehashdialogComponent implements OnInit {
  public breakpoint: number; // Breakpoint observer code
  public value1: any ;
  public pubkey: any;
  public privatekey:any;
  public joinSplitForm: FormGroup;
  wasFormChanged = false;
  public notehashArrayfordailog: any = [];
  public validate_privatekey: string = "";
  public owneraddress:string="";
  constructor(  private fb: FormBuilder,
    public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public dat: any,private alertService:AlertService,private Api:ApiService) {
      console.log(this.dat+"form data")
      this.owneraddress = dat.owner
      this.notehashArrayfordailog =[dat]
      console.log(this.notehashArrayfordailog,"array")
      // this.Api.getnotehashes().then(res=>{
      //   // console.log(res.data);
      //   // this.notehashArrayfordailog=res.data.filter(
      //   // res => res.note_hash==this.dat);
         
      // })
    }

  public ngOnInit(): void {
    this.joinSplitForm = this.fb.group({
      value1: [this.value1, [Validators.required, Validators.pattern('[0-9]')]],
      pubkey: [this.pubkey, [Validators.required, Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]],
      privatekey:[this.privatekey, [Validators.required, Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]],
    
    });
    this.breakpoint = window.innerWidth <= 600 ? 1 : 2; // Breakpoint observer code
    // this.getnotehashcom();
  }

 
  joinSplit() {
    console.log("model-based form submitted");
    console.log(this.joinSplitForm.value);
    console.log("Viewingkey:"+this.notehashArrayfordailog[0].viewKey);
    console.log("AssetAddress:"+this.notehashArrayfordailog[0].assetAddress);
    console.log("publickey:"+this.notehashArrayfordailog[0].publicKey)
    console.log("ownervalue:"+this.notehashArrayfordailog[0].value);
    console.log("pubkey:"+this.joinSplitForm.value.pubkey);
    console.log("value:"+this.joinSplitForm.value.value1);
    var payload = {
      inputnoteviewkey:this.notehashArrayfordailog[0].viewKey,
      azaccountaddress: this.notehashArrayfordailog[0].assetAddress,
      azaccountaddresspublickey: this.notehashArrayfordailog[0].publicKey,
      ownervalue:this.notehashArrayfordailog[0].value,
      notehash: this.notehashArrayfordailog[0].note_hash,
      aztecaccounuserpubkey:this.joinSplitForm.value.pubkey,     
      uservalue:this.joinSplitForm.value.value1,
      privatekey:this.joinSplitForm.value.privatekey
    
    }
     
    console.log("payload");
    console.log(payload);
    this.Api.joinsplit(payload).then(res=>{
      console.log("response");
      console.log(res);
    })
}


validatePrivateKey() {
  if (this.validate_privatekey.length > 66 || this.validate_privatekey.length == 65 || this.validate_privatekey.length <= 0) {
    return;
  }
  if (this.validate_privatekey.length == 66) {
    this.validate_privatekey = this.validate_privatekey.substring(2, 66)
  }
  if (this.validate_privatekey.length == 64) {
    this.validate_privatekey = this.validate_privatekey;
  }


  this.Api.getpubkeyAndAddress(this.validate_privatekey).then(res => {
    console.log(res, "validating")
    // console.log(this.Api.web3.utils.toChecksumAddress(res['address']) , this.Api.web3.utils.toChecksumAddress(this.owneraddress));
    // console.log(this.Api.web3.utils.toChecksumAddress(res['address']) === this.Api.web3.utils.toChecksumAddress(this.owneraddress));
    // if(res['address'] != this.owneraddress){
    if (this.Api.web3.utils.toChecksumAddress(res['address']) !== this.Api.web3.utils.toChecksumAddress(this.owneraddress)) {
      this.alertService.showToaster("Mismatch !!!");
      return;
    }
    if (this.Api.web3.utils.toChecksumAddress(res['address']) === this.Api.web3.utils.toChecksumAddress(this.owneraddress)) {
      console.log(this.Api.web3.utils.toChecksumAddress(res['address']) === this.Api.web3.utils.toChecksumAddress(this.owneraddress),"match result")
      this.alertService.hideToster();        
      return;
    }
  })
}
  openDialog(): void {
    // console.log(this.notehashArrayfordailog);
    console.log(this.wasFormChanged);
    
    if(this.joinSplitForm.dirty) {
      const dialogRef = this.dialog.open(NotehashdialogdeleteComponent, {
        width: '340px',
      });
    } else {
      this.dialog.closeAll();
    }
  }

  // tslint:disable-next-line:no-any
  public onResize(event: any): void {
    this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
  }


  formChanged() {
    this.wasFormChanged = true;
  }

}
