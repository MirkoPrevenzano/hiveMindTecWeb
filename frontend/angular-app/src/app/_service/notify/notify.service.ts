import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component } from '@angular/core';


@Injectable({
  providedIn: 'root',

  
})
export class NotifyService {

  constructor(public snackBar:MatSnackBar) { }
  openSnackBar(message: string, action: string, type: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [type]
    });
  }
}
