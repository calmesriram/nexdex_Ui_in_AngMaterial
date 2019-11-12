import { Component, OnInit } from '@angular/core';
import { ApiService, AlertService } from 'src/app/shared';
import { ToastrService } from 'ngx-toastr';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { NotehashdialogComponent } from '../notehashdialog/notehashdialog.component';


@Component({
  selector: 'app-notehash',
  templateUrl: './notehash.component.html',
  styleUrls: ['./notehash.component.scss']
})
export class NotehashComponent implements OnInit {
  public notehashArray: any = [];
  public notehashArrayfordailog: any = [];

  constructor(private Api : ApiService,private toast:ToastrService ,private alertService:AlertService,private dialog:MatDialog) { }

  ngOnInit() {
    this.getnotehash();
  }
  
  public getnotehash() {
    this.Api.getnotehashes().then(res=>{
        this.notehashArray=res.data.filter(
        data => data.status===1);
    })
    console.log(this.notehashArray)
  }
  openDialog(data): void {
    console.log(data);
    const dialogRef = this.dialog.open(NotehashdialogComponent,{
      data:data,
      width: '640px',disableClose: true 
    });
}
}
