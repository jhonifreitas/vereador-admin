import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { AnimationOptions } from 'ngx-lottie';

import { Admin } from 'src/app/models/admin';
import { Global } from 'src/app/models/global';
import { Marker } from 'src/app/models/marker';
import { Chart, ChartData } from 'src/app/models/chart';
import { Access, Analytics } from 'src/app/models/analytics';

import { UtilsService } from 'src/app/services/utils/utils.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import createHTMLMapMarker from "src/app/services/google-maps/html-map-marker";
import { FBAnalyticsService } from 'src/app/services/firebase/analytics/analytics.service';

declare var google: any;
declare var MarkerClusterer: any;

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
  loadingAccessChart = true;
  accessChart: Chart[] = [];
  lottieOpts: AnimationOptions = {path: '/assets/lottie/loading.json'};

  private map: any;
  private zoom = 8;
  private markers = [];

  constructor(
    private router: Router,
    private global: Global,
    private utils: UtilsService,
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

          this.getAnalytics();

          this.loadingMap = false;
        }, 500);
      }
    })
  }

  getAnalytics() {
    if(!this.user.superUser && this.user.config){
      this.fbAnalytics.getByConfig(this.user.config).subscribe(analytics => {
        this.mountMarker(analytics);
        this.loadAccessChart(analytics);
      });
    }else{
      this.fbAnalytics.all().subscribe(analytics => {
        this.mountMarker(analytics);
        this.loadAccessChart(analytics);
      });
    }
  }

  loadAccessChart(analytics: Analytics[]) {
    const allAccess:ChartData[] = [];

    for(const analytic of analytics){
      for(const access of analytic.access){
        const date = access.date.toDate();
        const accessIndex = allAccess.findIndex(data => this.utils.formatDate(data.x, 'yyyy-MM-dd') == this.utils.formatDate(date, 'yyyy-MM-dd'));
        if(accessIndex > -1){
          allAccess[accessIndex].y += 1;
        }else{
          allAccess.push({x: date.getTime(), y: 1});
        }
      }
    }
    allAccess.sort((a, b) => a.x - b.x);
    this.accessChart.push({name: 'Geral', data: allAccess});
    this.loadingAccessChart = false;
  }

  mountMarker(analytics: Analytics[]){
    this.access = [];
    for(const analytic of analytics){
      this.access = this.access.concat(analytic.access);
      for(const access of analytic.access){
        const marker: Marker = {
          id: analytic.ip,
          lat: access.lat,
          lng: access.long,
          color: 'primary'
        };
        this.addMarker(marker);
      }
    }

    new MarkerClusterer(this.map, this.markers, {
      imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
    });
  }

  addMarker(obj: Marker) {
    const class_name = ['marker', 'color-'+obj.color];
    let marker = createHTMLMapMarker({
      latlng: new google.maps.LatLng(obj.lat, obj.lng),
      html: '<div class="'+class_name.join(' ')+'"></div>',
    });
    marker.set('id', obj.id);
    this.markers.push(marker);
  }
}
