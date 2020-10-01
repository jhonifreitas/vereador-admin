import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Global } from 'src/app/models/global';
import { Config } from 'src/app/models/config';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { FBConfigService } from 'src/app/services/firebase/config/config.service';

@Component({
  selector: 'app-config-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class ConfigFormPage implements OnInit {

  private id: string;
  private object: Config;
  private donationMsg = 'Olá, abaixo nossos dados Bancários para nos ajudar:\n\nNome Completo:\nCNPJ:\nBanco:\nAgência:\nConta:';

  saving = false;
  form: FormGroup;
  image: {path: string; new: boolean, file?: Blob;};
  pixelPlaceholder = `!function(f,b,e,v,n,t,s)\n{if(f.fbq)return;n=f.fbq=function(){n.callMethod?\nn.callMethod.apply(n,arguments):n.queue.push(arguments)};\nif(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';\nn.queue=[];t=b.createElement(e);t.async=!0;\nt.src=v;s=b.getElementsByTagName(e)[0];\ns.parentNode.insertBefore(t,s)}(window, document,'script',\n'https://connect.facebook.net/en_US/fbevents.js');\nfbq('init', 'SEU ID DO PIXEL VAI AQUI');\nfbq('track', 'PageView');`;

  constructor(
    private global: Global,
    private router: Router,
    private utils: UtilsService,
    private formGroup: FormBuilder,
    private storage: StorageService,
    private fbConfig: FBConfigService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.form = this.formGroup.group({
      shareMsg: new FormControl('', Validators.required),
      title: new FormControl('', Validators.required),
      url: new FormControl('', [Validators.required, this.validatorUrl]),
      keywords: new FormControl([], Validators.required),
      description: new FormControl('', Validators.required),
      donation: new FormControl(this.donationMsg, Validators.required),
      pixel: new FormControl(''),
    });
  }

  ngOnInit(): void {
    if(!this.id && !this.global.hasPermission('configuration', 'can-add')){
      this.router.navigate(['/error/403']);
    }else if(this.id && !this.global.hasPermission('configuration', 'can-update')){
      this.router.navigate(['/error/403']);
    }

    if(this.id){
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
    value = value.replace(/^\s+|\s+$/g, ''); // trim
    value = value.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
      value = value.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    value = value.replace(/[^a-z0-9 -]/g, ''); // remove invalid chars
    value = value.replace(/\s+/g, '-'); // collapse whitespace and replace by -
    value = value.replace(/-+/g, '-'); // collapse dashes
    this.controlUrl.setValue(value);
  }

  checkUrl() {
    const url = this.object ? this.object.url : '';
    if(this.controlUrl.value && (url != this.controlUrl.value)){
      this.fbConfig.getByURL(this.controlUrl.value).subscribe(config => {
        if(config && (this.id || '') != this.controlUrl.value){
          this.controlUrl.setErrors({exist: true});
        }
      })
    }
  }

  getConfig() {
    this.fbConfig.get(this.id).subscribe(user => {
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
    this.form.get('shareMsg').setValue(this.object.shareMsg);
    this.form.get('title').setValue(this.object.title);
    this.form.get('url').setValue(this.object.url);
    this.form.get('keywords').setValue(this.object.keywords);
    this.form.get('description').setValue(this.object.description);
    this.form.get('donation').setValue(this.object.donation || this.donationMsg);
    this.form.get('pixel').setValue(this.object.pixel);
  }

  async takeImage(event: any) {
    const loader = this.utils.loading('Comprimindo imagem...');
    const compress = await this.utils.uploadCompress(event.addedFiles[0]);
    this.image = {path: compress.base64, file: compress.file, new: true};
    loader.componentInstance.msg = 'Imagem comprimida!';
    loader.componentInstance.done();
  }

  async saveImage(id: string) {
    if(this.image && this.image.new && this.image.file){
      await this.fbConfig.addImage(id, this.image.file);
    }
  }

  async deleteImage() {
    if(!this.image.new){
      this.utils.delete().then(async _ => {
        await this.fbConfig.deleteImage(this.object.id);
        this.image = null;
      }).catch(_ => {})
    }else{
      this.image = null;
    }
  }

  shareWhatsapp() {
    let msg = this.form.get('shareMsg').value.replace(/\n/gm, '%0a');
    msg += `%0a%0a`;
    msg += `${environment.host}/${this.controlUrl.value}`;
    window.open(`whatsapp://send?text=${msg}`);
  }

  async save() {
    if(this.form.valid){
      this.saving = true;
      const data = this.form.value;
      if(this.id){
        await this.fbConfig.update(this.id, data);
        await this.saveImage(this.id);
      }else{
        await this.fbConfig.create(data).then(async doc => {
          await this.saveImage(doc.id);
        });
      }
      this.saving = false;
      if(this.storage.getUser().superUser){
        this.router.navigateByUrl('/configuracoes');
      }
      this.utils.message('Configuração salva com sucesso!', 'success');
    }else{
      this.utils.message('Verifique os dados antes de salvar!', 'warn');
    }
  }
}
