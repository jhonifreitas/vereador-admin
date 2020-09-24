import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { AnimationOptions } from 'ngx-lottie';

import { Global } from 'src/app/models/global';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminListComponent implements OnInit {

  loading = true;
  lottieOpts: AnimationOptions = {path: '/assets/lottie/loading.json'};

  constructor(
    private router: Router,
    private global: Global
    ) { }

  ngOnInit() {
    if(!this.global.hasPermission('admin', 'can-view')){
      this.router.navigate(['/error/403']);
    }
  }
}
