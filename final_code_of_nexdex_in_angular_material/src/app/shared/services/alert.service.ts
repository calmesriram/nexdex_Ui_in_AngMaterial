import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class AlertService {

  constructor(private snackBar: MatSnackBar) {}

  public showToaster(msg: string): void {
    this.snackBar.open(msg, null, {
      duration: 3500,
      panelClass: ['green-snackbar']
    });
  }

  public showToaster1(msg: string): void {
    this.snackBar.open(msg, null, {
      duration: 3500,
      panelClass: ['red-snackbar']
    });
  }
}
