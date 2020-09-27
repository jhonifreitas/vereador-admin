import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Config } from 'src/app/models/config';
import { Category } from 'src/app/models/category';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { FBConfigService } from 'src/app/services/firebase/config/config.service';
import { FBCategoryService } from 'src/app/services/firebase/category/category.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class CategoryFormPage implements OnInit {

  saving = false;
  form: FormGroup;
  configs: Config[];
  isSuperUser: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Category,
    private utils: UtilsService,
    private formGroup: FormBuilder,
    private storage: StorageService,
    private fbConfig: FBConfigService,
    private fbCategory: FBCategoryService,
    private dialogRef: MatDialogRef<CategoryFormPage>,
  ) {
    const user = this.storage.getUser();
    this.isSuperUser = user.superUser;
    let configValue = user.config || '';
    this.form = this.formGroup.group({
      config: new FormControl(configValue, Validators.required),
      name: new FormControl('', Validators.required),
      text: new FormControl('', Validators.required),
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
    this.form.get('name').setValue(this.data.name);
    this.form.get('text').setValue(this.data.text);
  }

  getConfigs() {
    this.fbConfig.all().subscribe(configs => {
      this.configs = configs;
    })
  }

  async save() {
    if(this.form.valid){
      this.saving = true;
      const data = this.form.value;
      if(this.data && this.data.id){
        await this.fbCategory.update(this.data.id, data);
      }else{
        await this.fbCategory.create(data);
      }
      this.saving = false;
      this.utils.message('Permissão salva com sucesso!', 'success');
      this.dialogRef.close(true);
    }else{
      this.utils.message('Verifique os dados antes de salvar!', 'warn');
    }
  }
}
