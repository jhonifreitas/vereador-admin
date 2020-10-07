import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { Global } from 'src/app/models/global';
import { Category } from 'src/app/models/category';
import { CategoryDetailPage } from '../detail/detail.component';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { FBConfigService } from 'src/app/services/firebase/config/config.service';
import { FBCategoryService } from 'src/app/services/firebase/category/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class CategoryListPage implements OnInit {

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  private object_list: Category[];

  canView = this.global.hasPermission('category', 'can-view');
  canAdd = this.global.hasPermission('category', 'can-add');
  canUpdate = this.global.hasPermission('category', 'can-update');
  canDelete = this.global.hasPermission('category', 'can-delete');

  filter: string;
  loading = true;
  dataSource: MatTableDataSource<Category>;
  displayedColumns: string[] = ['order', 'name', 'actions'];

  constructor(
    private router: Router,
    private global: Global,
    private utils: UtilsService,
    private storage: StorageService,
    private fbConfig: FBConfigService,
    private fbCategory: FBCategoryService,
  ) {
    if(this.storage.getUser().superUser){
      this.displayedColumns.splice(2, 0, '_config');
    }
  }

  ngOnInit(): void {
    if(!this.global.hasPermission('category', 'can-list')){
      this.router.navigate(['/error/403']);
    }
    if(this.storage.getUser().superUser){
      this.fbCategory.all().subscribe(categories => {
        this.object_list = categories;
        this.loadData(categories);
      });
    }else{
      this.fbCategory.getByUrl(this.storage.getUser().config).subscribe(categories => {
        this.object_list = categories;
        this.loadData(categories);
      });
    }
  }

  loadData(categories: Category[]) {
    for(const category of categories){
      if(category.config){
        this.fbConfig.get(category.config).subscribe(config => category._config = config)
      }
    }
    this.dataSource = new MatTableDataSource<Category>(categories);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.loading = false;
  }

  applyFilter() {
    this.dataSource.filter = this.filter.trim().toLowerCase();
  }

  async drop(event: CdkDragDrop<string[]>) {
    this.loading = true;
    let newOrderData: Category[] = [];
    newOrderData = newOrderData.concat(this.dataSource.data);
    this.dataSource = null;
    moveItemInArray(newOrderData, event.previousIndex, event.currentIndex);
    for(const index in newOrderData){
      if(newOrderData[index].order != this.object_list[index].order){
        await this.fbCategory.update(newOrderData[index].id, {order: parseInt(index)})
      }
    }
    this.loadData(newOrderData);
    this.loading = false;
  }

  openDetail(object?: Category) {
    if(this.canView){
      this.utils.detail(CategoryDetailPage, object);
    }
  }

  async delete(object: Category) {
    await this.fbCategory.delete(object.id).then(_ => {
      this.ngOnInit();
      this.utils.message('Categoria excluída com sucesso!', 'success');
    });
  }

  confirmDelete(object: Category) {
    this.utils.delete().then(async _ => {
      this.delete(object);
    }).catch(_ => {})
  }
}
