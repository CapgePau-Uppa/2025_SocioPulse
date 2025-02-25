import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  imports: [
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent implements OnInit{
  project: any;
  username : any = sessionStorage.getItem('username');

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    console.log(this.username);
  }
}
