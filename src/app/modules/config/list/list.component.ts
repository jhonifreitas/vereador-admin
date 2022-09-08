import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';

import { Config } from 'src/app/models/config';
import { Global } from 'src/app/models/global';

import { ConfigDetailPage } from '../detail/detail.component';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { FBConfigService } from 'src/app/services/firebase/config/config.service';

@Component({
  selector: 'app-config-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ConfigListPage implements OnInit {

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  canView = this.global.hasPermission('configuration', 'can-view');
  canAdd = this.global.hasPermission('configuration', 'can-add');
  canUpdate = this.global.hasPermission('configuration', 'can-update');
  canDelete = this.global.hasPermission('configuration', 'can-delete');

  filter: string;
  loading = true;
  dataSource: MatTableDataSource<Config>;
  displayedColumns: string[] = ['title', 'url', 'domain', 'image', 'actions'];

  constructor(
    private global: Global,
    private router: Router,
    private utils: UtilsService,
    private storage: StorageService,
    private fbConfig: FBConfigService,
  ) {
  }

  ngOnInit(): void {
    const user = this.storage.getUser();
    if (this.global.hasPermission('configuration', 'can-view') && !user.superUser && user.config) {
      this.router.navigateByUrl(`configuracoes/formulario/${user.config}`);
    } else if(!this.global.hasPermission('configuration', 'can-list')){
      this.router.navigate(['/error/403']);
    }
    this.fbConfig.all().subscribe(configs => {
      configs.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
      this.dataSource = new MatTableDataSource<Config>(configs);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.loading = false;
    });
  }

  applyFilter() {
    this.dataSource.filter = this.filter.trim().toLowerCase();
  }

  openDetail(object?: Config) {
    if(this.canView){
      this.utils.detail(ConfigDetailPage, object);
    }
  }
  
  async deleteImages(id: string){
    await this.fbConfig.deleteImage(id, 'mobile');
    await this.fbConfig.deleteImage(id, 'desktop');
  }

  async delete(object: Config) {
    await this.fbConfig.delete(object.id).then(async _ => {
      if (object.image) await this.deleteImages(object.id);
      this.ngOnInit();
      this.utils.message('Configuração excluída com sucesso!', 'success');
    });
  }

  confirmDelete(object: Config) {
    this.utils.delete().then(async _ => {
      this.delete(object);
    }).catch(_ => {})
  }
}
