import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {NavbarComponent} from './navbar/navbar.component';
import {MatSidenav,MatSidenavContent, MatSidenavContainer} from '@angular/material/sidenav';
import {MatListItem, MatNavList} from '@angular/material/list';
import {LoginModalComponent} from './login-modal/login-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, MatSidenavContainer, MatSidenavContent, MatNavList, RouterLink, MatSidenav, MatListItem, MatButton, MatCard],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'socio-pulse';
  opened: boolean = false;
  constructor(private dialog: MatDialog) {
  }
  openDialog() {
    const dialogRef = this.dialog.open(LoginModalComponent)

    dialogRef.afterClosed().subscribe(result => {
      if (result){
        console.log(`Dialog result: ${result}`);
      }
     //TODO: login logic to be determined here

    });
  }
}
