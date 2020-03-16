import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { ApiService,AlertService } from 'src/app/shared';
// import { BilateralComponent } from '../bilateral/bilateral.component';

@Component({
  selector: 'app-bilateralReqdialog',
  templateUrl: './bilateralReqdialog.component.html',
  styleUrls: ['./bilateralReqdialog.component.scss']
})
export class bilateralReqdialogComponent implements OnInit {
  public breakpoint: number; // Breakpoint observer code

  public bilateral_data:any;
  public privatekey:any;
  public loader:boolean; 
  public validate_privatekey:String="";
  // public notehashArrayfordailog: any = [];
  constructor( public fb: FormBuilder,
    public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public dat: any,public alertService:AlertService,public Api:ApiService) {
      this.bilateral_data = dat;
      console.log(this.bilateral_data,"selected one")
    }

  ngOnInit() {
    this.breakpoint = window.innerWidth <= 600 ? 1 : 2; // Breakpoint observer code
  }

  validatePrivateKey() {
    // console.log(this.validate_privatekey,"privatekey")
    // if (this.validate_privatekey.length > 66 || this.validate_privatekey.length == 65 || this.validate_privatekey.length <= 0) {
    //   return;
    // }
    // if (this.validate_privatekey.length == 66) {
    //   this.validate_privatekey = this.validate_privatekey.substring(2, 66)
    // }
    // if (this.validate_privatekey.length == 64) {
    //   this.validate_privatekey = this.validate_privatekey;
    // }
    
  }

  public onResize(event: any): void {
    this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
  }

  public onSubmit(form: NgForm) {
    let query  = form.value
    console.log(query);
    this.Api.bilateral_taker(this.bilateral_data,query.taker_privateKey).then(res =>{
      // if(res){
        setTimeout(()=>{
          this.dialog.closeAll();
        },3000)
      // }
    })
    
  }
  cancelBitrequestList() {    
    this.loader = true;
    // console.log(data,"Cancel function")
    this.Api.CancelbitRequestLists(this.bilateral_data).then(res => {
      console.log(res, "Cancel request")
      if (res.status == true) {
        // this.bi.bitRequestLists();
        this.loader = false;
        this.alertService.showToaster(res.data); 
        setTimeout(() => {
          this.dialog.closeAll();
        }, 3000);       
      }
    }).catch(e => {
      this.loader = false;
      this.alertService.showToaster1(e);
      console.log(e);
      return;
    })
  }

  test(a){
 if (a.keyCode === 27) {
    //  console.log('Escape!');
    this.dialog.closeAll();
    this.dialog._afterAllClosed.subscribe(result => {
      // if (result) {
        console.log("closing the popup")
        // this.bi.bitRequestLists();
      // }
    });
 }
  }

  openDialog(): void {    
      this.dialog.closeAll();
  }
}
