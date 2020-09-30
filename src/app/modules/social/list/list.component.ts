import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';

import { Social } from 'src/app/models/social';
import { Global } from 'src/app/models/global';
import { SocialFormPage } from '../form/form.component';
import { SocialDetailPage } from '../detail/detail.component';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { FBSocialService } from 'src/app/services/firebase/social/social.service';
import { FBConfigService } from 'src/app/services/firebase/config/config.service';

@Component({
  selector: 'app-social-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class SocialListPage implements OnInit {

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  canView = this.global.hasPermission('social', 'can-view');
  canAdd = this.global.hasPermission('social', 'can-add');
  canUpdate = this.global.hasPermission('social', 'can-update');
  canDelete = this.global.hasPermission('social', 'can-delete');

  filter: string;
  loading = true;
  dataSource: MatTableDataSource<Social>;
  displayedColumns: string[] = ['type', 'url', 'actions'];

  constructor(
    private router: Router,
    private global: Global,
    private utils: UtilsService,
    private storage: StorageService,
    private fbConfig: FBConfigService,
    private fbSocial: FBSocialService,
  ) {
    if(this.storage.getUser().superUser){
      this.displayedColumns.splice(2, 0, '_config');
    }
  }

  ngOnInit(): void {
    if(!this.global.hasPermission('social', 'can-list')){
      this.router.navigate(['/error/403']);
    }
    if(this.storage.getUser().superUser){
      this.fbSocial.all().subscribe(socials => {
        this.loadData(socials)
      });
    }else{
      this.fbSocial.getByUrl(this.storage.getUser().config).subscribe(socials => {
        this.loadData(socials)
      });
    }
  }

  loadData(socials: Social[]) {
    for(const social of socials){
      if(social.config){
        this.fbConfig.get(social.config).subscribe(config => social._config = config)
      }
    }
    this.dataSource = new MatTableDataSource<Social>(socials);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.loading = false;
  }

  applyFilter() {
    this.dataSource.filter = this.filter.trim().toLowerCase();
  }

  openDetail(object?: Social) {
    if(this.canView){
      this.utils.detail(SocialDetailPage, object);
    }
  }

  openForm(object?: Social) {
    this.utils.form(SocialFormPage, object).then(_ => {
      this.ngOnInit();
    });
  }

  async delete(object: Social) {
    await this.fbSocial.delete(object.id).then(_ => {
      this.ngOnInit();
      this.utils.message('Aba excluída com sucesso!', 'success');
    });
  }

  confirmDelete(object: Social) {
    this.utils.delete().then(async _ => {
      this.delete(object);
    }).catch(_ => {})
  }
}
