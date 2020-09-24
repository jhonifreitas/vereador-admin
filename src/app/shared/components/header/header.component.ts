import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { FBAuthService } from 'src/app/services/firebase/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();

  constructor(
    private fbAuth: FBAuthService
  ) { }

  ngOnInit(): void {
    let width = window.innerWidth;
    if(width <= 960 && !this.toggleSideBarForMe.closed){
      this.toggleSideBar();
    }
  }

  toggleSideBar() {
    this.toggleSideBarForMe.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }

  logout() {
    this.fbAuth.signOut();
  }
}
