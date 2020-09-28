import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Permission } from 'src/app/models/permission';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { FBPermissionService } from 'src/app/services/firebase/permission/permission.service';

@Component({
  selector: 'app-permission-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class PermissionFormPage implements OnInit {

  saving = false;
  form: FormGroup;
  pages = [
    {value: 'dashboard', name: 'Dashboard'},
    {value: 'tab', name: 'Aba'},
    {value: 'category', name: 'Categoria'},
    {value: 'social', name: 'Social'},
    {value: 'configuration', name: 'Configuração'},
  ];
  roles = [
    {value: 'can-list', name: 'Pode visualizar listagem'},
    {value: 'can-add', name: 'Pode salvar'},
    {value: 'can-update', name: 'Pode editar'},
    {value: 'can-delete', name: 'Pode deletar'},
    {value: 'can-view', name: 'Pode visualizar'},
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Permission,
    private utils: UtilsService,
    private formGroup: FormBuilder,
    private fbPermission: FBPermissionService,
    private dialogRef: MatDialogRef<PermissionFormPage>,
  ) {
    this.form = this.formGroup.group({
      page: new FormControl('', Validators.required),
      role: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    if(this.data){
      this.setData();
    }
  }

  setData() {
    this.form.get('page').setValue(this.data.page);
    this.form.get('role').setValue(this.data.role);
  }

  async save() {
    if(this.form.valid){
      this.saving = true;
      const data = this.form.value;
      if(this.data && this.data.id){
        await this.fbPermission.update(this.data.id, data);
      }else{
        await this.fbPermission.create(data);
      }
      this.saving = false;
      this.utils.message('Permissão salva com sucesso!', 'success');
      this.dialogRef.close(true);
    }else{
      this.utils.message('Verifique os dados antes de salvar!', 'warn');
    }
  }
}
