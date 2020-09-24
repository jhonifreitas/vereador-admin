import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';

import { Global } from 'src/app/models/global';
import { Permission } from 'src/app/models/permission';
import { PermissionFormPage } from '../form/form.component';
import { PermissionDetailPage } from '../detail/detail.component';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { FBTempleService } from 'src/app/services/firebase/temple/temple.service';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class PermissionListComponent implements OnInit {

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  canView = this.global.hasPermission('temple', 'can-view');
  canAdd = this.global.hasPermission('temple', 'can-add');
  canUpdate = this.global.hasPermission('temple', 'can-update');
  canDelete = this.global.hasPermission('temple', 'can-delete');

  filter: string;
  loading = true;
  dataSource: MatTableDataSource<Temple>;
  displayedColumns: string[] = ['name', 'city', 'state', 'image', 'actions'];

  constructor(
    private global: Global,
    private router: Router,
    private utils: UtilsService,
    private fbTemple: FBTempleService,
  ) {
  }

  ngOnInit(): void {
    if(!this.global.hasPermission('temple', 'can-list')){
      this.router.navigate(['/error/403']);
    }
    this.fbTemple.all().subscribe(temples => {
      this.dataSource = new MatTableDataSource<Temple>(temples);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.loading = false;
    });
  }

  applyFilter() {
    this.dataSource.filter = this.filter.trim().toLowerCase();
  }

  openDetail(object?: Temple) {
    if(this.canView){
      this.utils.detail(TempleDetailPage, object);
    }
  }

  openForm(object?: Temple) {
    this.utils.form(TempleFormPage, object);
  }

  async deleteImage(id: string, url: string){
    const path = url.split('/').pop().split('?')[0].replace(/%2F/g, '/').replace(/%20/g, ' ');
    await this.fbTemple.deleteImage(id, path);
  }

  async delete(object: Temple) {
    await this.fbTemple.delete(object.id);
    if(object.image){
      await this.deleteImage(object.id, object.image);
    }
    this.utils.message('Templo excluído com sucesso!', 'success');
  }

  confirmDelete(object: Temple) {
    this.utils.delete().then(async _ => {
      this.delete(object);
    }).catch(_ => {})
  }
}
