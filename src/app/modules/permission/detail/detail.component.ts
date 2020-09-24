import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Permission } from 'src/app/models/permission';

@Component({
  selector: 'app-permission-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class PermissionDetailPage implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public object: Permission,
    private dialogRef: MatDialogRef<PermissionDetailPage>,
  ) { }

  ngOnInit(): void {
  }

  close(){
    this.dialogRef.close();
  }
}
