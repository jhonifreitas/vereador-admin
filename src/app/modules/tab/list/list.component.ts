import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';

import { Tab } from 'src/app/models/tab';
import { Global } from 'src/app/models/global';
import { TabDetailPage } from '../detail/detail.component';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { FBTabService } from 'src/app/services/firebase/tab/tab.service';

@Component({
  selector: 'app-tab-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class TabListPage implements OnInit {

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  canView = this.global.hasPermission('tab', 'can-view');
  canAdd = this.global.hasPermission('tab', 'can-add');
  canUpdate = this.global.hasPermission('tab', 'can-update');
  canDelete = this.global.hasPermission('tab', 'can-delete');

  filter: string;
  loading = true;
  dataSource: MatTableDataSource<Tab>;
  displayedColumns: string[] = ['name', 'text', 'actions'];

  constructor(
    private router: Router,
    private global: Global,
    private utils: UtilsService,
    private fbTab: FBTabService,
    private storage: StorageService,
  ) {
    if(this.storage.getUser().superUser){
      this.displayedColumns.splice(2, 0, 'config');
    }
  }

  ngOnInit(): void {
    if(!this.global.hasPermission('tab', 'can-list')){
      this.router.navigate(['/error/403']);
    }
    this.fbTab.all().subscribe(tabs => {
      this.dataSource = new MatTableDataSource<Tab>(tabs);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.loading = false;
    });
  }

  applyFilter() {
    this.dataSource.filter = this.filter.trim().toLowerCase();
  }

  openDetail(object?: Tab) {
    if(this.canView){
      this.utils.detail(TabDetailPage, object);
    }
  }

  async delete(object: Tab) {
    await this.fbTab.delete(object.id).then(_ => {
      this.ngOnInit();
      this.utils.message('Aba excluída com sucesso!', 'success');
    });
  }

  confirmDelete(object: Tab) {
    this.utils.delete().then(async _ => {
      this.delete(object);
    }).catch(_ => {})
  }
}