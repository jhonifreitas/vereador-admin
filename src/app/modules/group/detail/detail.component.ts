import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Group } from 'src/app/models/group';
import { FBPermissionService } from 'src/app/services/firebase/permission/permission.service';

@Component({
  selector: 'app-group-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class GroupDetailPage implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public object: Group,
    private fbPermission: FBPermissionService,
    private dialogRef: MatDialogRef<GroupDetailPage>,
  ) { }

  ngOnInit(): void {
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
