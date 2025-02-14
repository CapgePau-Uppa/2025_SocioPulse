import { Component, OnInit } from '@angular/core';
import {NgbCarousel, NgbSlide} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-featured',
  templateUrl: './featured.component.html',
  styleUrls: ['./featured.component.scss' ],
  standalone: true,
  imports: [
    NgbCarousel,
    NgbSlide
  ]
})
export class FeaturedComponent implements OnInit {
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  ngOnInit() {

  }
}
