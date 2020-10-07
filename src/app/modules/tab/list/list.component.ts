import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { Tab } from 'src/app/models/tab';
import { Global } from 'src/app/models/global';
import { TabDetailPage } from '../detail/detail.component';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { FBTabService } from 'src/app/services/firebase/tab/tab.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { FBConfigService } from 'src/app/services/firebase/config/config.service';

@Component({
  selector: 'app-tab-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class TabListPage implements OnInit {

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  private object_list: Tab[];

  canView = this.global.hasPermission('tab', 'can-view');
  canAdd = this.global.hasPermission('tab', 'can-add');
  canUpdate = this.global.hasPermission('tab', 'can-update');
  canDelete = this.global.hasPermission('tab', 'can-delete');

  filter: string;
  loading = true;
  dataSource: MatTableDataSource<Tab>;
  displayedColumns: string[] = ['order', 'name', 'actions'];

  constructor(
    private router: Router,
    private global: Global,
    private utils: UtilsService,
    private fbTab: FBTabService,
    private storage: StorageService,
    private fbConfig: FBConfigService,
  ) {
    if(this.storage.getUser().superUser){
      this.displayedColumns.splice(2, 0, '_config');
    }
  }

  ngOnInit(): void {
    if(!this.global.hasPermission('tab', 'can-list')){
      this.router.navigate(['/error/403']);
    }
    if(this.storage.getUser().superUser){
      this.fbTab.all().subscribe(tabs => {
        this.object_list = tabs;
        this.loadData(tabs);
      });
    }else{
      this.fbTab.getByUrl(this.storage.getUser().config).subscribe(tabs => {
        this.object_list = tabs;
        this.loadData(tabs);
      });
    }
  }

  loadData(tabs: Tab[]) {
    for(const tab of tabs){
      if(tab.config){
        this.fbConfig.get(tab.config).subscribe(config => tab._config = config)
      }
    }
    this.dataSource = new MatTableDataSource<Tab>(tabs);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.loading = false;
  }

  applyFilter() {
    this.dataSource.filter = this.filter.trim().toLowerCase();
  }

  async drop(event: CdkDragDrop<string[]>) {
    this.loading = true;
    let newOrderData: Tab[] = [];
    newOrderData = newOrderData.concat(this.dataSource.data);
    this.dataSource = null;
    moveItemInArray(newOrderData, event.previousIndex, event.currentIndex);
    for(const index in newOrderData){
      if(newOrderData[index].order != this.object_list[index].order){
        await this.fbTab.update(newOrderData[index].id, {order: parseInt(index)})
      }
    }
    this.loadData(newOrderData);
    this.loading = false;
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
