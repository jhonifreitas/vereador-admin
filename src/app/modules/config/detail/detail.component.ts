import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Config } from 'src/app/models/config';

@Component({
  selector: 'app-config-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class ConfigDetailPage implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public object: Config,
    private dialogRef: MatDialogRef<ConfigDetailPage>,
  ) { }

  ngOnInit(): void {
  }

  close(){
    this.dialogRef.close();
  }
}
