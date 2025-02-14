import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {FeaturedComponent} from '../featured/featured.component';

@Component({
  selector: 'app-root',
  imports: [
    MatButton,
    RouterLink,
    FeaturedComponent
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

}
