import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Social } from 'src/app/models/social';
import { Config } from 'src/app/models/config';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { FBConfigService } from 'src/app/services/firebase/config/config.service';
import { FBSocialService } from 'src/app/services/firebase/social/social.service';

@Component({
  selector: 'app-social-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class SocialFormPage implements OnInit {

  saving = false;
  form: FormGroup;
  configs: Config[];
  isSuperUser: boolean;
  types = [
    {value: 'facebook', name: 'Facebook'},
    {value: 'instagram', name: 'Instagram'},
    {value: 'youtube', name: 'Youtube'},
    {value: 'linkedin', name: 'Linkedin'},
  ]

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Social,
    private utils: UtilsService,
    private fbSocial: FBSocialService,
    private formGroup: FormBuilder,
    private storage: StorageService,
    private fbConfig: FBConfigService,
    private dialogRef: MatDialogRef<SocialFormPage>,
  ) {
    const user = this.storage.getUser();
    this.isSuperUser = user.superUser;
    let configValue = user.config || '';
    this.form = this.formGroup.group({
      config: new FormControl(configValue, Validators.required),
      type: new FormControl('', Validators.required),
      url: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    if(this.isSuperUser){
      this.getConfigs();
    }
    if(this.data){
      this.setData();
    }
  }

  setData() {
    this.form.get('config').setValue(this.data.config);
    this.form.get('type').setValue(this.data.type);
    this.form.get('url').setValue(this.data.url);
  }

  getConfigs() {
    this.fbConfig.all().subscribe(configs => {
      this.configs = configs;
    })
  }

  get url() {
    return this.form.get('url');
  }

  async save() {
    if(this.form.valid){
      this.saving = true;
      const data = this.form.value;
      if(this.data && this.data.id){
        await this.fbSocial.update(this.data.id, data);
      }else{
        data.order = 0;
        await this.fbSocial.create(data);
      }
      this.saving = false;
      this.utils.message('Social salvo com sucesso!', 'success');
      this.dialogRef.close(true);
    }else{
      this.utils.message('Verifique os dados antes de salvar!', 'warn');
    }
  }
}
