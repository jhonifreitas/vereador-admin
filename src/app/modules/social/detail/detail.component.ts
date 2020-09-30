import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Social } from 'src/app/models/social';
import { StorageService } from 'src/app/services/storage/storage.service';
import { FBConfigService } from 'src/app/services/firebase/config/config.service';

@Component({
  selector: 'app-social-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class SocialDetailPage implements OnInit {

  isSuperUser: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public object: Social,
    private storage: StorageService,
    private fbConfig: FBConfigService,
    private dialogRef: MatDialogRef<SocialDetailPage>,
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
