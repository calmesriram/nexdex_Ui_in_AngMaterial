import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {MatDialogRef,MatDialog} from '@angular/material';
import { NotehashdialogComponent } from '../notehashdialog/notehashdialog.component';
@Component({
  selector: 'app-notehashdialogdelete',
  templateUrl: './notehashdialogdelete.component.html',
  styleUrls: ['./notehashdialogdelete.component.scss']
})
export class NotehashdialogdeleteComponent implements OnInit {

  // constructor() { }
  constructor(private fb: FormBuilder,
    private dialog: MatDialog,
                  private dialogRef: MatDialogRef<NotehashdialogdeleteComponent>) {} // Closing dialog window
    
    public cancel(): void { // To cancel the dialog window
    this.dialogRef.close();
    }
    
    public cancelN(): void { 
        this.dialog.closeAll();
    }


  ngOnInit() {
   }

}
