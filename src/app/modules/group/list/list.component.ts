import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';

import { Group } from 'src/app/models/group';
import { GroupFormPage } from '../form/form.component';
import { GroupDetailPage } from '../detail/detail.component';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { FBGroupService } from 'src/app/services/firebase/group/group.service';

@Component({
  selector: 'app-group-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class GroupListPage implements OnInit {

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  canView = this.storage.getUser().superUser;
  canAdd = this.storage.getUser().superUser;
  canUpdate = this.storage.getUser().superUser;
  canDelete = this.storage.getUser().superUser;

  filter: string;
  loading = true;
  dataSource: MatTableDataSource<Group>;
  displayedColumns: string[] = ['name', 'actions'];

  constructor(
    private router: Router,
    private utils: UtilsService,
    private storage: StorageService,
    private fbGroup: FBGroupService,
  ) {
  }

  ngOnInit(): void {
    if(!this.storage.getUser().superUser){
      this.router.navigate(['/error/403']);
    }
    this.fbGroup.all().subscribe(groups => {
      groups.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
      this.dataSource = new MatTableDataSource<Group>(groups);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.loading = false;
    });
  }

  applyFilter() {
    this.dataSource.filter = this.filter.trim().toLowerCase();
  }

  openDetail(object?: Group) {
    if(this.canView){
      this.utils.detail(GroupDetailPage, object);
    }
  }

  openForm(object?: Group) {
    this.utils.form(GroupFormPage, object).then(_ => {
      this.ngOnInit();
    });
  }

  async delete(object: Group) {
    await this.fbGroup.delete(object.id).then(_ => {
      this.ngOnInit();
      this.utils.message('Grupo excluído com sucesso!', 'success');
    });
  }

  confirmDelete(object: Group) {
    this.utils.delete().then(async _ => {
      this.delete(object);
    }).catch(_ => {})
  }
}
