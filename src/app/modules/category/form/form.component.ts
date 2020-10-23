import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Config } from 'src/app/models/config';
import { Global } from 'src/app/models/global';
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

  private id: string;

  saving = false;
  form: FormGroup;
  object: Category;
  configs: Config[];
  isSuperUser: boolean;

  constructor(
    private router: Router,
    private global: Global,
    private utils: UtilsService,
    private formGroup: FormBuilder,
    private storage: StorageService,
    private fbConfig: FBConfigService,
    private fbCategory: FBCategoryService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
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
    if(!this.id && !this.global.hasPermission('configuration', 'can-add')){
      this.router.navigate(['/error/403']);
    }else if(this.id && !this.global.hasPermission('configuration', 'can-update')){
      this.router.navigate(['/error/403']);
    }
    if(this.isSuperUser){
      this.getConfigs();
    }
    if(this.id){
      this.getCategory();
    }
  }

  setData() {
    this.form.get('config').setValue(this.object.config);
    this.form.get('name').setValue(this.object.name);
    this.form.get('text').setValue(this.object.text);
  }

  getCategory() {
    this.fbCategory.get(this.id).subscribe(category => {
      if(category){
        this.object = category;
        this.setData();
      }else{
        this.router.navigate(['/categorias']);  
        this.utils.message('Categoria não encontrada!', 'warn');
      }
    })
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

      const tagImgs = [].slice.call(document.getElementsByClassName('ql-editor')[0].getElementsByTagName('img'));
      for(const tag of tagImgs){
        const src:string = tag.src;
        if(src.indexOf('base64') >= 0){
          const file = this.utils.covertBase64ToBlob(src);
          const url = await this.fbCategory.addImage(file);
          data.text = data.text.replace(src, url);
        }
      }

      if(this.id){
        await this.fbCategory.update(this.id, data);
      }else{
        data.order = 0;
        await this.fbCategory.create(data);
      }
      this.saving = false;
      this.utils.message('Categoria salva com sucesso!', 'success');
      this.router.navigateByUrl('/categorias');
    }else{
      this.utils.message('Verifique os dados antes de salvar!', 'warn');
    }
  }
}
