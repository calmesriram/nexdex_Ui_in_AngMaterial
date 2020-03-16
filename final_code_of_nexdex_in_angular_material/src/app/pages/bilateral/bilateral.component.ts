import { Component, OnInit,OnDestroy } from '@angular/core';
import { ApiService, AlertService } from 'src/app/shared';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { bilateralReqdialogComponent } from '../bilateralReqdialog/bilateralReqdialog.component';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-bilateral',
  templateUrl: './bilateral.component.html',
  styleUrls: ['./bilateral.component.scss']
})
export class BilateralComponent implements OnInit {

  public notehashArray: any = [];
  public notehashArrayfordailog: any = [];
  public alladdress_user: any = [];
  public bal: String = "";
  public sym: String = "";
  public selectedValue: any;
  public selectedZk: any;
  public totalBalance: any;
  public showBilateral = false;
  public zkAddress = [];
  public zkObject = {};
  public users = {};
  public users_address_arr = [];
  public bit_reqs = [];
  public loader: boolean;
  public biletaral_req_array: any = [];
  public loop_clear:any;
  public displayedColumns:any=[];
  dataSource_array:any=[];  
  constructor(public Api: ApiService, public alertService: AlertService, public dialog: MatDialog) {
// this.Api.bitRequestLists_arg(0)
// this.bitreqList_0();   
this.displayedColumns = ['position', 'Bidding User', 'Bidding Symbol', 'Bidding Count'];  
    this.getAlladdressUser();
    this.Api.getAddress().then(res => {
      this.zkAddress = res.data
      console.log(res);

    })
    this.Api.getUserList().then(res => {
      console.log(res, "get users list");
      if (res.status == true) {
        res.data.forEach(async userQ => {
          this.users[Object.keys(userQ)[0]] = Object.values(userQ)[0]
        })
      }

      // this.users = res.data.map(user => { return user});
    })
  }

  ngOnInit() {
    this.bitRequestLists()
    this.bitreqList_0();  
    this.loop_clear = setInterval(()=>{
      this.bitreqList_0();  
  },3000)
  }

  ngOnDestroy(){   
    clearInterval(this.loop_clear);
  }

  bitreqList_0(){    
     this.Api.bitRequestLists_arg(0).then(res => {
      // console.log(res);
      if (res.status == true) {
        this.bit_reqs = res.taker_pending_data
        if(this.dataSource_array.length != res.taker_pending_data){
          this.dataSource_array = new MatTableDataSource(res.taker_pending_data);
        }
      }
    })    
  }

  getAlladdressUser() {
    this.Api.getAlladdress_user().then(res => {
      console.log(res, "all address user")

      this.alladdress_user = res.data
    })
  }

  showUserAdd(newObj) {
    this.users_address_arr = newObj.value
  }

  showBilateralAdd() {
    console.log(this.selectedZk);

    this.showBilateral = true
  }

  specificaddressDetails() {
    this.notehashArray.length = 0;
    this.Api.getPerticularAddress_data(this.selectedValue).then(res => {
      console.log(res);

      if (res.data.length > 0) {
        res.data.forEach(dat => {
          console.log(dat, "foreach")

          if (dat["status"] == 0) {
            dat["status"] = "Pending";
          }
          if (dat["status"] == 1) {
            dat["status"] = "SendingToBlockchain";
          }
          if (dat["status"] == 2) {
            dat["status"] = "Conformed";
          }
          if (dat["status"] == 3) {
            dat["status"] = "WaitingForApproval";
          }
          if (dat["status"] == 4) {
            dat["status"] = "Active";
          }
          if (dat["status"] == 5) {
            dat["status"] = "Failed";
          }
          if (dat["status"] == 6) {
            dat["status"] = "Deleted";
          }
          if (dat["status"] == 7) {
            dat["status"] = "Blocked";
          }
          if (dat["status"] == 8) {
            dat["status"] = "WaitingForBlockchainResponse";
          }
          this.notehashArray.push(dat)
          console.log(this.notehashArray, "array")
        });
        this.zkObject = res.total_balance
        this.totalBalance = Object.values(res.total_balance)
        console.log(res, "specific address details")
     
      }
    })
  }


  public onSubmit(form: NgForm) {
    let query  = form.value
    query["bid_address"] = this.selectedValue
    query["bid_zkaddress"] = this.selectedZk.key
    this.Api.bilateral_maker(query).then(res =>{
      // console.log(res);      
    })
  }

  public request_approve(data) {
    const dialogRef = this.dialog.open(bilateralReqdialogComponent,{
      data:data,
      width: '640px',disableClose: true 
    });
  }

  bitRequestLists() {
    this.Api.bitRequestLists().then(res => {
      this.biletaral_req_array = res;
      console.log(res, "bit req list")
      // this.Api.loader=false;
    }).catch(e => {
      console.log(e);
      return;
    })
  }
  // cancelBitrequestList(data) {
  //   console.log(data)
  //   this.loader = true;
  //   // console.log(data,"Cancel function")
  //   this.Api.CancelbitRequestLists(data).then(res => {
  //     console.log(res, "Cancel request")
  //     if (res.status == true) {
  //       this.loader = false;
  //       this.alertService.showToaster(res.data);
  //       this.bitRequestLists()
  //       this.bitreqList_0();
  //     }
  //   }).catch(e => {
  //     this.loader = false;
  //     this.alertService.showToaster1(e);
  //     console.log(e);
  //     return;
  //   })
  // }
  // openDialog(pass_data): void {
  //   // console.log(pass_data,"Pass") 
  //   const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
  //     width: '350px',
  //     data: "Do you confirm the cancel of this request?"
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.cancelBitrequestList(pass_data);
  //     }
  //   });
  // }
}
