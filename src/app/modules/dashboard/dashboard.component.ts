import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { AnimationOptions } from 'ngx-lottie';

import { Global } from 'src/app/models/global';

declare var google: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardPage implements OnInit {

  @ViewChild('map') mapElement: ElementRef;

  onlines: number;
  loadingMap = true;
  lottieOpts: AnimationOptions = {path: '/assets/lottie/loading.json'};

  private map: any;
  private zoom = 8;
  private markers = [];

  constructor(
    private router: Router,
    private global: Global,
  ) { }

  ngOnInit(): void {
    if(!this.global.hasPermission('dashboard', 'can-view')){
      this.router.navigate(['/error/403']);
    }

    this.loadMap();
  }

  loadMap() {
    navigator.geolocation.getCurrentPosition(resp => {
      const lat = resp.coords.latitude;
      const lng = resp.coords.longitude;

      if(lat && lng){
        setTimeout(async () => {
          this.map = new google.maps.Map(this.mapElement.nativeElement, {
            center: {
              lat: lat,
              lng: lng
            },
            zoom: this.zoom,
            ...this.global.map
          });
          this.markUsers();
          this.loadingMap = false;
        }, 500);
      }
    })
  }

  markUsers() {

  }
}
