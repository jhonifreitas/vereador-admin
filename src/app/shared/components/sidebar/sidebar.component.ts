import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { Global } from 'src/app/models/global';
import { StorageService } from 'src/app/services/storage/storage.service';

interface Page {
  title: string;
  url?: string;
  icon: string;
  hidden: boolean;
  permission?: {
    page: string;
    role: string;
  };
  subPages?: Page[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();

  pages: Page[] = [
    { title: 'Dashboard', url: '/', icon: 'dashboard', hidden: false, permission: {page: 'dashboard', role: 'can-view'} },
    { title: 'Abas', url: '/abas', icon: 'bookmarks', hidden: false, permission: {page: 'tab', role: 'can-list'} },
    { title: 'Categorias', url: '/categorias', icon: 'category', hidden: false, permission: {page: 'category', role: 'can-list'} },
    { title: 'Sociais', url: '/sociais', icon: 'facebook', hidden: false, permission: {page: 'social', role: 'can-list'} },
    { title: 'Configurações', url: '/configuracoes', icon: 'miscellaneous_services', hidden: false, permission: {page: 'configuration', role: 'can-view'} },
    { title: 'Autorização', icon: 'verified_user', hidden: false, subPages: [
      { title: 'Usuários', url: '/auth/usuarios', icon: 'person', hidden: false, permission: {page: 'admin', role: 'can-list'} },
      { title: 'Grupos', url: '/auth/grupos', icon: 'group', hidden: false, permission: {page: 'groups', role: 'can-list'} },
      { title: 'Permissões', url: '/auth/permissoes', icon: 'lock_open', hidden: false, permission: {page: 'permissions', role: 'can-list'} },
    ]},
  ]

  constructor(
    private global: Global,
    public storage: StorageService
  ) { }

  ngOnInit(): void {
    const interval = setInterval(() => {
      if(this.storage.getUser()){
        clearInterval(interval);
        for(const page of this.pages) {
          page.hidden = !this.hasPermission(page);
          if(page.subPages){
            for(const subpage of page.subPages) {
              subpage.hidden = !this.hasPermission(subpage);
            }
          }
        }
      }
    }, 500)
  }

  closeSideBar(){
    let width = window.innerWidth;
    if(width <= 960 && !this.toggleSideBarForMe.closed){
      this.toggleSideBarForMe.emit();
      setTimeout(() => {
        window.dispatchEvent(
          new Event('resize')
        );
      }, 300);
    }
  }

  hasPermission(page: Page): boolean {
    if(page.subPages){
      for(const subPage of page.subPages) {
        if(this.global.hasPermission(subPage.permission.page, subPage.permission.role)){
          return true;
        }
      }
      return false;
    }else{
      return this.global.hasPermission(page.permission.page, page.permission.role)
    }
  }
}
