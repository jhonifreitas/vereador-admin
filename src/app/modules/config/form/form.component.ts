import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Global } from 'src/app/models/global';
import { Config } from 'src/app/models/config';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { FBConfigService } from 'src/app/services/firebase/config/config.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-config-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class ConfigFormPage implements OnInit {

  private url: string;
  private object: Config;

  saving = false;
  form: FormGroup;
  image: {path: string; new: boolean, file?: Blob;};

  constructor(
    private global: Global,
    private router: Router,
    private utils: UtilsService,
    private formGroup: FormBuilder,
    private storage: StorageService,
    private fbConfig: FBConfigService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.url = this.activatedRoute.snapshot.paramMap.get('url');
    this.form = this.formGroup.group({
      sharePhone: new FormControl('', Validators.required),
      shareMsg: new FormControl('', Validators.required),
      title: new FormControl('', Validators.required),
      url: new FormControl('', [Validators.required, this.validatorUrl]),
      keywords: new FormControl([], Validators.required),
      description: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    if(!this.url && !this.global.hasPermission('configuration', 'can-add')){
      this.router.navigate(['/error/403']);
    }else if(this.url && !this.global.hasPermission('configuration', 'can-update')){
      this.router.navigate(['/error/403']);
    }

    if(this.url){
      this.getConfig();
    }
  }

  get controlUrl() {
    return this.form.get('url');
  }

  validatorUrl(form: FormControl) {
    let result:{
      hasSpace?: boolean;
      hasUppercase?: boolean;
      hasSpecialChar?: boolean
    } = {};
    const value: string = form.value;
    if(value){
      if(value.match(/ /)){
        result.hasSpace = true;
      } else if (value.match(/[A-Z]/)) {
        result.hasUppercase = true;
      } else if (value.match(/[^A-Z0-9]-/ig)) {
        result.hasSpecialChar = true;
      }
    }
    return result
  }

  changeTitle() {
    let value:string = this.form.get('title').value;
    // REPLACE SPACE TO HIFEN
    value = value.toLowerCase().replace(/ /g, '-');
    // REMOVE SPECIAL CHAR
    value = value.replace(/[^A-Z0-9]-/ig, '');
    // REPLACE ACCENTS
    value = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    this.controlUrl.setValue(value);
  }

  checkUrl() {
    if(this.controlUrl.value){
      this.fbConfig.get(this.controlUrl.value).subscribe(config => {
        if(config && (this.url || '') != this.controlUrl.value){
          this.controlUrl.setErrors({exist: true});
        }
      })
    }
  }

  getConfig() {
    this.fbConfig.get(this.url).subscribe(user => {
      if(user){
        this.object = user;
        this.setData();
      }else{
        this.router.navigate(['/configuracoes']);  
        this.utils.message('Configuração não encontrada!', 'warn');
      }
    })
  }

  setData() {
    if(this.object.image){
      this.image = {path: this.object.image, new: false};
    }
    this.form.get('sharePhone').setValue(this.object.sharePhone);
    this.form.get('shareMsg').setValue(this.object.shareMsg);
    this.form.get('title').setValue(this.object.title);
    this.form.get('url').setValue(this.object.url);
    this.form.get('keywords').setValue(this.object.keywords);
    this.form.get('description').setValue(this.object.description);
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

  async saveImage(id: string) {
    if(this.image && this.image.new && this.image.file){
      await this.fbConfig.addImage(id, this.image.file);
    }
  }

  async deleteImage() {
    if(!this.image.new){
      this.utils.delete().then(async _ => {
        await this.fbConfig.deleteImage(this.object.url);
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
      if(this.url == data.url){
        await this.fbConfig.update(this.url, data);
        await this.saveImage(this.url);
      }else{
        await this.fbConfig.create(data);
        await this.saveImage(data.url);
        if(this.url){
          this.fbConfig.delete(this.url);
        }
      }
      this.saving = false;
      if(!this.storage.getUser().config){
        this.router.navigateByUrl('/configuracoes');
      }
      this.utils.message('Configuração salva com sucesso!', 'success');
    }else{
      this.utils.message('Verifique os dados antes de salvar!', 'warn');
    }
  }
}
