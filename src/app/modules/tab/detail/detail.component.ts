import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Tab } from 'src/app/models/tab';
import { StorageService } from 'src/app/services/storage/storage.service';
import { FBConfigService } from 'src/app/services/firebase/config/config.service';

@Component({
  selector: 'app-tab-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class TabDetailPage implements OnInit {

  isSuperUser: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public object: Tab,
    private storage: StorageService,
    private fbConfig: FBConfigService,
    private dialogRef: MatDialogRef<TabDetailPage>,
  ) { }

  ngOnInit(): void {
    this.isSuperUser = this.storage.getUser().superUser;
    if(this.isSuperUser){
      this.fbConfig.get(this.object.config).subscribe(config => this.object._config = config)
    }
  }

  close(){
    this.dialogRef.close();
  }
}
