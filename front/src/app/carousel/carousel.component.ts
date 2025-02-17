import { Component } from '@angular/core';
import {CarouselItemComponent} from '../carousel-item/carousel-item.component';
import { NgbCarousel, NgbSlide } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-carousel',
  imports: [CarouselItemComponent, NgbSlide, NgbCarousel],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent {
  carouselItems = [
    {
      title: 'Item 1',
      location: 'Location 1',
      description: 'Description for item 1',
      icon: 'assets/imgs/park.png'
    },
    {
      title: 'Item 2',
      location: 'Location 2',
      description: 'Description for item 2',
      icon: 'assets/imgs/recycle.png'
    },
    {
      title: 'Item 3',
      location: 'Location 3',
      description: 'Description for item 3',
      icon: 'assets/imgs/road.png'
    }
  ];
}
