import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Group } from 'src/app/models/group';
import { Permission } from 'src/app/models/permission';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { FBGroupService } from 'src/app/services/firebase/group/group.service';
import { FBPermissionService } from 'src/app/services/firebase/permission/permission.service';

@Component({
  selector: 'app-group-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class GroupFormPage implements OnInit {

  saving = false;
  form: FormGroup;
  permissions: Permission[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Group,
    private utils: UtilsService,
    private formGroup: FormBuilder,
    private fbGroup: FBGroupService,
    private fbPermission: FBPermissionService,
    private dialogRef: MatDialogRef<GroupFormPage>,
  ) {
    this.form = this.formGroup.group({
      name: new FormControl('', Validators.required),
      permissions: new FormControl([], Validators.required),
    });
  }

  ngOnInit(): void {
    this.getPermissions();
    if(this.data){
      this.setData();
    }
  }

  setData() {
    this.form.get('name').setValue(this.data.name);
    this.form.get('permissions').setValue(this.data.permissions);
  }

  getPermissions() {
    this.fbPermission.all().subscribe(permissions => {
      this.permissions = permissions;
    })
  }

  async save() {
    if(this.form.valid){
      this.saving = true;
      const data = this.form.value;
      if(this.data && this.data.id){
        await this.fbGroup.update(this.data.id, data);
      }else{
        await this.fbGroup.create(data);
      }
      this.saving = false;
      this.utils.message('Groupo salvo com sucesso!', 'success');
      this.dialogRef.close(true);
    }else{
      this.utils.message('Verifique os dados antes de salvar!', 'warn');
    }
  }
}
