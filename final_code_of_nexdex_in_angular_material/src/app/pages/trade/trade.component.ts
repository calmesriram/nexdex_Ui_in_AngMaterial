import { Component, OnInit, OnDestroy,ViewChild } from '@angular/core';
import { ApiService, AlertService } from 'src/app/shared';
import { MatDialog } from '@angular/material/dialog';
import { DialogtradeComponent } from '../dialogtrade/dialogtrade.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

declare var require: any;
var $ = require("jquery");
import 'datatables.net';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss']
})

export class TradeComponent implements OnInit, OnDestroy { 

  public clear_int: any;
  public alladdress_user: any[];
  public bal_info: any = [];
  public add_info: any = [];
  public depositobj = {};
  public user_balance = {}
  isLinear = false;
  public temparray1 = [];
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  public privatekey_accouts_det: any;
  public privatekey_accouts_det2: any;
  public privatekeydetail: any;
  public privatekeydetail2: any;
  public tx_info: any = [];
  public selectedcheckbox: Object = {};
  public submit_btn: boolean = true;
  public hello: any = [];
  public escrow_acc_det: any = [];
  public order_book_balance: any = [];
  public proceedbtn: boolean = false;  
  // public dtTrigger: Subject<any> = new Subject();  
  dataSource_array:any=[];  
  displayedColumns:any=[];
  

  // @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatSort,{static: false}) sort: MatSort;  

  constructor(public _formBuilder: FormBuilder, public Api: ApiService, public dialog: MatDialog) { }
  
  ngOnInit() { 

    // this.dataSource_array.sort = this.sort;
    // this.tx_info.paginator = this.paginator;   
    this.displayedColumns = ['position', 'Address', 'Symbol', 'Amount','Action'];        
    this.firstFormGroup = this._formBuilder.group({
      privatekey: ['', Validators.required],
      zkaddress: ['', Validators.required],
      amount: ['', Validators.required],
      chkbox: ['', Validators.required]
    });
    this.getescorw_acc_det();
    this.Api.escrowAccount();
    this.getorderbookbalance();
    this.getAlladdressUser();
    this.withdraw_txinfo();    
    this.rerender();
  }
  
  rerender(): void {
    this.clear_int = setInterval(() => {      
      this.withdraw_txinfo();
    }, 5000)
  }

  ngOnDestroy() {
    clearInterval(this.clear_int)
  }
  getpub_address_escorw() {
    this.proceedbtn = false;
    if (this.privatekeydetail2.length > 66 ||
      this.privatekeydetail2.length < 64 ||
      this.privatekeydetail2.length == 65 ||
      this.privatekeydetail2.length <= 0 ||
      this.privatekeydetail2 == "") {
      this.proceedbtn = false;
      return;
    }
    if (this.privatekeydetail2.length == 66) {
      this.privatekeydetail2 = (this.privatekeydetail2).substring(2, 66);
      this.proceedbtn = true;
    }
    if (this.privatekeydetail2.length == 64) {
      this.privatekeydetail2 = this.privatekeydetail2;
      this.proceedbtn = true;
    }

  }
  getorderbookbalance() {
    this.order_book_balance.length = 0;
    this.Api.orderbook_balance().then(res => {
      console.log("Order BOOk Balance", res)
      if (res.statu == true) {
        // if (this.order_book_balance.length != res.data.length) {
          this.order_book_balance = res.data;
        // }
        // console.log(this.order_book_balance, "order book balance")
      }
    })
  }
  getescorw_acc_det() {
    this.escrow_acc_det.length = 0;
    this.Api.getAddress().then(res => {
      if (res.status == true) {
        this.escrow_acc_det = res.data;
      }
    })
  }
  withdraw_txinfo() {
    this.Api.withdraw_tx_info().then(res => {
      // console.log(res)
      if(res["status"] == true){
        if (this.tx_info.length != res.data.length) {
          this.tx_info = res.data
          console.log(res.data)
          this.dataSource_array = new MatTableDataSource(res.data);
          console.log(this.dataSource_array);
          console.log(this.dataSource_array.sort);
          // this.dtTrigger.next();
          
        }
      }
    })
  }
  // applyFilter(filterValue: string) {
  //   console.log(filterValue)
  //   this.tx_info.filter = filterValue.trim().toLowerCase();

  //   if (this.tx_info.paginator) {
  //     this.tx_info.paginator.firstPage();
  //   }
  // }
  trade_widthdraw_joinsplit() {
    if (this.temparray1.length > 0) {
      this.submit_btn = false;


    }
    else {
      this.submit_btn = true;
    }

  }
  trade_widthdraw_pvt_check() {
    if (this.privatekeydetail.length > 66 || this.privatekeydetail.length < 64 ||
      this.privatekeydetail.length == 65 || this.privatekeydetail.length <= 0 ||
      this.privatekeydetail == "") {
      // this.detbool = false;
      return;
    }

    if (this.privatekeydetail.length == 66) {
      this.privatekeydetail = (this.privatekeydetail).substring(2, 66)
    }
    if (this.privatekeydetail.length == 64) {
      this.privatekeydetail = this.privatekeydetail
    }

    this.Api.getpubkeyAndAddress(this.privatekeydetail).then(res => {
      // resadd = res["address"];
      this.privatekey_accouts_det = res;
    })
  }
  onSubmit() {
    this.Api.getpubkeyAndAddress(this.firstFormGroup.value.privatekey).then(res => {
      let payload = {
        "session_uuid": sessionStorage.getItem("session_uuid"),
        "user_address": res['address'],
        "user_publicKey": res['publicKey'],
        "zkAssetAddress": this.firstFormGroup.value.zkaddress.value.zkaddress,
        "symbol": this.firstFormGroup.value.zkaddress.value.symbol,
        "amount": this.firstFormGroup.value.amount
      }
      this.Api.add_withdraw(payload).then(result => {
        console.log("add_withdraw", result)
      })
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
  getpub_address() {
    if (this.privatekeydetail.length > 66 || this.privatekeydetail.length < 64 ||
      this.privatekeydetail.length == 65 || this.privatekeydetail.length <= 0 ||
      this.privatekeydetail == "") {
      // this.detbool = false;
      return;
    }

    if (this.privatekeydetail.length == 66) {
      this.privatekeydetail = (this.privatekeydetail).substring(2, 66)
    }
    if (this.privatekeydetail.length == 64) {
      this.privatekeydetail = this.privatekeydetail
    }

    this.Api.getpubkeyAndAddress(this.privatekeydetail).then(res => {
      this.privatekey_accouts_det = res;
    }).then(() => {
      this.get_balance(this.privatekey_accouts_det['address']).then(bal => {
        this.user_balance = bal
      })

    })
  }
   openDialog() {
    const dialogRef = this.dialog.open(DialogtradeComponent, { data: { "orderbook_deposit": true, "orderbook_withdraw": false } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.getorderbookbalance();
    });
  }
  openDialogwithdraw(withdraw_data) {
    console.log(withdraw_data,"*****************")
    // return;
    const dialogRef = this.dialog.open(DialogtradeComponent, { data: { "orderbook_deposit": false, "orderbook_withdraw": true, "data": withdraw_data } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  getAlladdressUser() {
    this.Api.getAlladdress_user().then(res => {
      if (res.status == true) {
        this.alladdress_user = res.data
      }
    }).catch(e => {
      console.log(e);
      return;
    })
  }


  async particularuserAddressdata() {
    await this.Api.getPerticularAddress_data(this.depositobj['address']['address']).then(res => {
      this.add_info = res['total_balance'];

    })
  }
}

