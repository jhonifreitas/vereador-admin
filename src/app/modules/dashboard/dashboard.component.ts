import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { AnimationOptions } from 'ngx-lottie';

import { Admin } from 'src/app/models/admin';
import { Global } from 'src/app/models/global';
import { Marker } from 'src/app/models/marker';

import { StorageService } from 'src/app/services/storage/storage.service';
import createHTMLMapMarker from "src/app/services/google-maps/html-map-marker";
import { FBAnalyticsService } from 'src/app/services/firebase/analytics/analytics.service';
import { Access, Analytics } from 'src/app/models/analytics';

declare var google: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardPage implements OnInit {

  @ViewChild('map') mapElement: ElementRef;

  user: Admin;
  loadingMap = true;
  access: Access[] = [];
  lottieOpts: AnimationOptions = {path: '/assets/lottie/loading.json'};

  private map: any;
  private zoom = 8;
  private markers = [];

  constructor(
    private router: Router,
    private global: Global,
    private storage: StorageService,
    private fbAnalytics: FBAnalyticsService
  ) {
    this.user = this.storage.getUser();
  }

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
    if(!this.user.superUser && this.user.config){
      this.fbAnalytics.getByConfig(this.user.config).subscribe(analytics => {
        this.mountMarker(analytics);
      });
    }else{
      this.fbAnalytics.all().subscribe(analytics => {
        this.mountMarker(analytics);
      });
    }
  }

  mountMarker(analytics: Analytics[]){
    for(const analytic of analytics){
      this.access = this.access.concat(analytic.access);
      for(const access of analytic.access){
        const marker: Marker = {
          id: analytic.id,
          lat: access.lat,
          lng: access.long,
          color: 'primary'
        };
        this.addMarker(marker);
      }
    }
  }

  addMarker(obj: Marker) {
    const class_name = ['marker', 'color-'+obj.color];
    if(obj.color== 'warn'){
      class_name.push('pulse');
    }
    let marker = createHTMLMapMarker({
      latlng: new google.maps.LatLng(obj.lat, obj.lng),
      map: this.map,
      html: '<div class="'+class_name.join(' ')+'"></div>',
    });
    marker.set('id', obj.id);

    const index = this.markers.findIndex(marker => marker.get('id') == obj.id);
    if(index >= 0){
      this.markers.splice(index, 1);
    }
    this.markers.push(marker);
  }
}
