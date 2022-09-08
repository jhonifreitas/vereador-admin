import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';

import { Permission } from 'src/app/models/permission';
import { PermissionFormPage } from '../form/form.component';
import { PermissionDetailPage } from '../detail/detail.component';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { FBPermissionService } from 'src/app/services/firebase/permission/permission.service';

@Component({
  selector: 'app-permission-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class PermissionListPage implements OnInit {

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  canView = this.storage.getUser().superUser;
  canAdd = this.storage.getUser().superUser;
  canUpdate = this.storage.getUser().superUser;
  canDelete = this.storage.getUser().superUser;

  filter: string;
  loading = true;
  dataSource: MatTableDataSource<Permission>;
  displayedColumns: string[] = ['page', 'role', 'actions'];

  constructor(
    private router: Router,
    private utils: UtilsService,
    private storage: StorageService,
    private fbPermission: FBPermissionService,
  ) {
  }

  ngOnInit(): void {
    if(!this.storage.getUser().superUser){
      this.router.navigate(['/error/403']);
    }
    this.fbPermission.all().subscribe(permissions => {
      permissions.sort((a, b) => a.page.toLowerCase().localeCompare(b.page.toLowerCase()));
      this.dataSource = new MatTableDataSource<Permission>(permissions);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.loading = false;
    });
  }

  applyFilter() {
    this.dataSource.filter = this.filter.trim().toLowerCase();
  }

  openDetail(object?: Permission) {
    if(this.canView){
      this.utils.detail(PermissionDetailPage, object);
    }
  }

  openForm(object?: Permission) {
    this.utils.form(PermissionFormPage, object).then(_ => {
      this.ngOnInit();
    });
  }

  async delete(object: Permission) {
    await this.fbPermission.delete(object.id).then(_ => {
      this.ngOnInit();
      this.utils.message('Permissão excluída com sucesso!', 'success');
    });
  }

  confirmDelete(object: Permission) {
    this.utils.delete().then(async _ => {
      this.delete(object);
    }).catch(_ => {})
  }
}
