import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService,AlertService } from 'src/app/shared';

@Component({
  selector: 'app-notehashdialog',
  templateUrl: './joinsplit_transfer.component.html',
  styleUrls: ['./joinsplit_transfer.component.scss']
})
export class JoinsplitTransferComponent implements OnInit {
  public breakpoint: number; // Breakpoint observer code
  public value1: any ;
  public pubkey: any;
  public privatekey:any;
  public joinSplitForm: FormGroup;
  wasFormChanged = false;
  public notehashArrayfordailog: any = {};
  public loader:boolean; 
  constructor(  private fb: FormBuilder,
    public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public dat: any,public alertService:AlertService,private Api:ApiService) {
      console.log(dat,"form data")
    
      this.notehashArrayfordailog = [dat]
      console.log(this.notehashArrayfordailog,"Array")
    }
  public ngOnInit(): void {
    this.joinSplitForm = this.fb.group({
      // value1: [this.value1, [Validators.required, Validators.pattern('[0-9]')]],
      // pubkey: [this.pubkey, [Validators.required, Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]],
      // privatekey:[this.privatekey, [Validators.required, Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]],
      value1: [this.value1, [Validators.required]],
      pubkey: [this.pubkey, [Validators.required]],
      privatekey:[this.privatekey, [Validators.required]],
    
    });
    this.breakpoint = window.innerWidth <= 600 ? 1 : 2; // Breakpoint observer code
    // this.getnotehashcom();
  }
  // getpubkeyAndAddress(pvtkey){
  //   this.Api.getpubkeyAndAddress(pvtkey);
  // }
 
  joinSplit() {
    this.loader=true;
    // this.dialog.closeAll();
    // return;
    console.log("model-based form submitted");

    // console.log(this.notehashArrayfordailog);

    this.notehashArrayfordailog[0]["request_amount"] = this.joinSplitForm.value.value1
    this.notehashArrayfordailog[0]["owner_privateKey"] = this.joinSplitForm.value.privatekey
    this.notehashArrayfordailog[0]["requester_publicKey"] = this.joinSplitForm.value.pubkey

    console.log(this.notehashArrayfordailog);
//  return;
    this.Api.joinsplit(this.notehashArrayfordailog[0]).then(res=>{
      console.log("response");
      console.log(res);
      if(res["status"] == true){
        this.Api.getAlladdress_user();
        this.loader=false;
        this.alertService.showToaster(res.b_response);
        setTimeout(()=>{
          this.dialog.closeAll();
        },3000)
        
      }
      if(res["status"] == false){
        this.loader=false;
        this.Api.getAlladdress_user();
        this.alertService.showToaster(res.b_response);
        setTimeout(()=>{
          this.dialog.closeAll();
        },3000)
      }
    }).catch(e =>{
      console.log(e);
      this.alertService.showToaster(e);
      return;
    })
}
cancelOption(){
  this.dialog.closeAll();
}
// public cancel(): void { // To cancel the dialog window
//   this.dialog.closeAll();
//   }
  // openDialog(): void {
  //   // console.log(this.notehashArrayfordailog);
  //   console.log(this.wasFormChanged);
    
  //   if(this.joinSplitForm.dirty) {
  //     const dialogRef = this.dialog.open(NotehashdialogdeleteComponent, {
  //       width: '340px',
  //     });
  //   } else {
  //     this.dialog.closeAll();
  //   }
  // }

  // tslint:disable-next-line:no-any
  public onResize(event: any): void {
    this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
  }


  formChanged() {
    this.wasFormChanged = true;
  }

}
