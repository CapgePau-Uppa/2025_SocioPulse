import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {NavbarComponent} from './navbar/navbar.component';
import {MatSidenav,MatSidenavContent, MatSidenavContainer} from '@angular/material/sidenav';
import {MatListItem, MatNavList} from '@angular/material/list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, MatSidenavContainer,MatSidenavContent, MatNavList, RouterLink, MatSidenav, MatListItem],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'socio-pulse';
  opened: boolean = false;
  openDialog() {
    console.log("sidenav_print");
  }
}
