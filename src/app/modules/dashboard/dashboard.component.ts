import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { AnimationOptions } from 'ngx-lottie';

import { Global } from 'src/app/models/global';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardPage implements OnInit {

  @ViewChild('map') mapElement: ElementRef;

  onlines: number;
  loadingMap = true;
  loadingUserChart = true;
  lottieOpts: AnimationOptions = {path: '/assets/lottie/loading.json'};

  constructor(
    private router: Router,
    private global: Global,
  ) { }

  ngOnInit() {
    if(!this.global.hasPermission('dashboard', 'can-view')){
      this.router.navigate(['/error/403']);
    }
  }
}
