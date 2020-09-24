import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';

import { Category } from 'src/app/models/category';
import { CategoryFormPage } from '../form/form.component';
import { CategoryDetailPage } from '../detail/detail.component';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { FBCategoryService } from 'src/app/services/firebase/category/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class CategoryListPage implements OnInit {

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  canView = this.storage.getUser().superUser;
  canAdd = this.storage.getUser().superUser;
  canUpdate = this.storage.getUser().superUser;
  canDelete = this.storage.getUser().superUser;

  filter: string;
  loading = true;
  dataSource: MatTableDataSource<Category>;
  displayedColumns: string[] = ['name', 'text', 'actions'];

  constructor(
    private router: Router,
    private utils: UtilsService,
    private storage: StorageService,
    private fbCategory: FBCategoryService,
  ) {
  }

  ngOnInit(): void {
    if(!this.storage.getUser().superUser){
      this.router.navigate(['/error/403']);
    }
    this.fbCategory.all().subscribe(categories => {
      this.dataSource = new MatTableDataSource<Category>(categories);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.loading = false;
    });
  }

  applyFilter() {
    this.dataSource.filter = this.filter.trim().toLowerCase();
  }

  openDetail(object?: Category) {
    if(this.canView){
      this.utils.detail(CategoryDetailPage, object);
    }
  }

  openForm(object?: Category) {
    this.utils.form(CategoryFormPage, object).then(_ => {
      this.ngOnInit();
    });
  }

  async delete(object: Category) {
    await this.fbCategory.delete(object.id).then(_ => {
      this.ngOnInit();
      this.utils.message('Permissão excluída com sucesso!', 'success');
    });
  }

  confirmDelete(object: Category) {
    this.utils.delete().then(async _ => {
      this.delete(object);
    }).catch(_ => {})
  }
}
