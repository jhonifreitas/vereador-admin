import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Admin } from 'src/app/models/admin';
import { FBGroupService } from 'src/app/services/firebase/group/group.service';
import { FBConfigService } from 'src/app/services/firebase/config/config.service';
import { FBPermissionService } from 'src/app/services/firebase/permission/permission.service';

@Component({
  selector: 'app-admin-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class AdminDetailPage implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public object: Admin,
    private fbGroup: FBGroupService,
    private fbConfig: FBConfigService,
    private fbPermission: FBPermissionService,
    private dialogRef: MatDialogRef<AdminDetailPage>,
  ) { }

  ngOnInit(): void {
    if(this.object.config){
      this.fbConfig.get(this.object.config).subscribe(config => this.object._config = config)
    }
    for(const groupId of this.object.groups){
      this.object._groups = [];
      this.fbGroup.get(groupId).subscribe(group => {
        this.object._groups.push(group);
      })
    }
    for(const permissionId of this.object.permissions){
      this.object._permissions = [];
      this.fbPermission.get(permissionId).subscribe(permission => {
        this.object._permissions.push(permission);
      })
    }
  }

  close(){
    this.dialogRef.close();
  }
}
