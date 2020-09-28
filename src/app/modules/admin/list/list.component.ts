import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';

import { Admin } from 'src/app/models/admin';
import { AdminFormPage } from '../form/form.component';
import { AdminDetailPage } from '../detail/detail.component';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { FBAdminService } from 'src/app/services/firebase/admin/admin.service';

@Component({
  selector: 'app-admin-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class AdminListPage implements OnInit {

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  canView = this.storage.getUser().superUser;
  canAdd = this.storage.getUser().superUser;
  canUpdate = this.storage.getUser().superUser;
  canDelete = this.storage.getUser().superUser;

  filter: string;
  loading = true;
  dataSource: MatTableDataSource<Admin>;
  displayedColumns: string[] = ['name', 'email', 'config', 'superUser', 'active', 'avatar', 'actions'];

  constructor(
    private router: Router,
    private utils: UtilsService,
    private storage: StorageService,
    private fbAdmin: FBAdminService,
  ) {
  }

  ngOnInit(): void {
    if(!this.storage.getUser().superUser){
      this.router.navigate(['/error/403']);
    }
    this.fbAdmin.all().subscribe(temples => {
      this.dataSource = new MatTableDataSource<Admin>(temples);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.loading = false;
    });
  }

  applyFilter() {
    this.dataSource.filter = this.filter.trim().toLowerCase();
  }

  openDetail(object?: Admin) {
    if(this.canView){
      this.utils.detail(AdminDetailPage, object);
    }
  }

  openForm(object?: Admin) {
    this.utils.form(AdminFormPage, object).then(res => {
      if(res){
        this.ngOnInit();
      }
    });
  }

  async delete(object: Admin) {
    await this.fbAdmin.delete(object.uid);
    this.utils.message('Usuário excluído com sucesso!', 'success');
  }

  confirmDelete(object: Admin) {
    this.utils.delete().then(async _ => {
      this.delete(object);
    }).catch(_ => {})
  }
}
