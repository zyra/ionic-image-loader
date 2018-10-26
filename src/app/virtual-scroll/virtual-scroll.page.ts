import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-virtual-scroll',
  templateUrl: './virtual-scroll.page.html',
  styleUrls: ['./virtual-scroll.page.scss'],
})
export class VirtualScrollPage implements OnInit {
    // images taken from pexels.com
    images: string[] = [
        'https://images.pexels.com/photos/27986/pexels-photo-27986.jpg?h=350&auto=compress&cs=tinysrgb',
        'https://images.pexels.com/photos/115010/tulips-red-red-tulips-garden-115010.jpeg?h=350&auto=compress&cs=tinysrgb',
        'https://images.pexels.com/photos/206393/pexels-photo-206393.jpeg?h=350&auto=compress&cs=tinysrgb',
        'https://images.pexels.com/photos/316591/pexels-photo-316591.jpeg?h=350&auto=compress&cs=tinysrgb',
        'https://images.pexels.com/photos/274060/pexels-photo-274060.jpeg?h=350&auto=compress&cs=tinysrgb',
        'https://images.pexels.com/photos/126345/pexels-photo-126345.jpeg?h=350&auto=compress&cs=tinysrgb',
        'https://images.pexels.com/photos/52977/coffee-coffee-maker-restaurant-cafe-52977.jpeg?h=350&auto=compress&cs=tinysrgb'
    ];

  constructor() { }

  ngOnInit() {
  }

}
