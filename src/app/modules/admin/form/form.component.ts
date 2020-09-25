import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Admin } from 'src/app/models/admin';
import { Group } from 'src/app/models/group';
import { Config } from 'src/app/models/config';
import { Permission } from 'src/app/models/permission';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { FBAdminService } from 'src/app/services/firebase/admin/admin.service';
import { FBGroupService } from 'src/app/services/firebase/group/group.service';
import { FBPermissionService } from 'src/app/services/firebase/permission/permission.service';
import { FBConfigService } from 'src/app/services/firebase/config/config.service';

@Component({
  selector: 'app-admin-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class AdminFormPage implements OnInit {

  saving = false;
  form: FormGroup;
  groups: Group[];
  configs: Config[];
  permissions: Permission[];
  image: {path: string; new: boolean, file?: Blob;};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Admin,
    private utils: UtilsService,
    private formGroup: FormBuilder,
    private fbAdmin: FBAdminService,
    private fbGroup: FBGroupService,
    private fbConfig: FBConfigService,
    private fbPermission: FBPermissionService,
    private dialogRef: MatDialogRef<AdminFormPage>,
  ) {
    this.form = this.formGroup.group({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      groups: new FormControl(''),
      config: new FormControl(''),
      permissions: new FormControl(''),
      password: new FormControl(''),
      confirmPass: new FormControl(''),
    }, {validators: !this.data ? this.validatorPassword : null});
  }

  ngOnInit(): void {
    this.getConfigs();
    this.getGroups();
    this.getPermissions();
    if(this.data){
      this.setData();
    }else{
      this.form.get('password').setValidators(Validators.required);
      this.form.get('confirmPass').setValidators(Validators.required);
    }
  }

  validatorPassword(group: FormGroup) {
    const password = group.get('password').value;
    const confirmControl = group.get('confirmPass');
    const required = confirmControl.value ? false : true;
    const result = {passNotSame: false, required: required};
    if(password != confirmControl.value){
      result.passNotSame = true;
    }
    confirmControl.setErrors(result);
    return {};
  }

  setData() {
    if(this.data.avatar){
      this.image = {path: this.data.avatar, new: false};
    }
    this.form.get('name').setValue(this.data.name);
    this.form.get('email').setValue(this.data.email);
    this.form.get('config').setValue(this.data.config);
    this.form.get('groups').setValue(this.data.groups);
    this.form.get('permissions').setValue(this.data.permissions);
  }

  getConfigs() {
    this.fbConfig.all().subscribe(configs => {
      this.configs = configs;
    })
  }

  getGroups() {
    this.fbGroup.all().subscribe(groups => {
      this.groups = groups;
    })
  }

  getPermissions() {
    this.fbPermission.all().subscribe(permissions => {
      this.permissions = permissions;
    })
  }

  takeImage(event: any) {
    const loader = this.utils.loading('Comprimindo imagem...');
    const reader = new FileReader();
    reader.addEventListener('load', async (event: any) => {
      let base64 = event.target.result as string;
      const compress = await this.utils.uploadCompress(base64);
      this.image = {path: compress.base64, file: compress.file, new: true};
      loader.componentInstance.done();
    });
    reader.readAsDataURL(event.addedFiles[0]);
  }

  async saveImage(id: string){
    if(this.image && this.image.new && this.image.file){
      await this.fbAdmin.addImage(id, this.image.file);
    }
  }

  async deleteImage(){
    if(!this.image.new){
      this.utils.delete().then(async _ => {
        await this.fbAdmin.deleteImage(this.data.uid);
        this.image = null;
      }).catch(_ => {})
    }else{
      this.image = null;
    }
  }

  async save() {
    if(this.form.valid){
      this.saving = true;
      const data = this.form.value;
      delete data.confirmPass;
      if(this.data && this.data.uid){
        delete data.password;
        await this.fbAdmin.update(this.data.uid, data);
        await this.saveImage(this.data.uid);
      }else{
        await this.fbAdmin.create(data).then(async doc => {
          await this.saveImage(doc.uid);
        });
      }
      this.saving = false;
      this.utils.message('Usuário salvo com sucesso!', 'success');
      this.dialogRef.close();
    }else{
      this.utils.message('Verifique os dados antes de salvar!', 'warn');
    }
  }
}
