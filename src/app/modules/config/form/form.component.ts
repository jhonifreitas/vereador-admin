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
  private object: Config = new Config();
  
  saving = false;
  form: FormGroup;
  owners: Config[];
  host = environment.host;
  
  mobile: {path: string; new: boolean, file?: Blob;};
  desktop: {path: string; new: boolean, file?: Blob;};

  donationMsg = 'Olá, abaixo nossos dados Bancários para nos ajudar:\n\nNome Completo:\nCNPJ:\nBanco:\nAgência:\nConta:';
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
      titleFeatured: new FormControl('', Validators.required),
      url: new FormControl('', [this.validatorUrl]),
      domain: new FormControl(''),
      keywords: new FormControl([], Validators.required),
      description: new FormControl('', Validators.required),
      donation: new FormControl(''),
      pixel: new FormControl(''),
    });
  }

  ngOnInit(): void {
    if (!this.id && !this.global.hasPermission('configuration', 'can-add')) {
      this.router.navigate(['/error/403']);
    } else if(this.id && !this.global.hasPermission('configuration', 'can-update')) {
      this.router.navigate(['/error/403']);
    }

    if (this.id) this.getConfig();

    if (this.storage.getUser().superUser) {
      this.form.addControl('owner', new FormControl(''));
      this.getOwners();
    }
  }

  get controls() {
    return this.form.controls;
  }

  validatorUrl(form: FormControl) {
    let result:{
      hasSpace?: boolean;
      hasUppercase?: boolean;
      hasSpecialChar?: boolean
    } = {};
    const value: string = form.value;
    if (value) {
      if (value.match(/ /)) {
        result.hasSpace = true;
      } else if (value.match(/[A-Z]/)) {
        result.hasUppercase = true;
      } else if (value.match(/[^A-Z0-9]-/ig)) {
        result.hasSpecialChar = true;
      }
    }
    return result;
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
    this.controls.url.setValue(value);
  }

  changeDomain() {
    const domain: string = this.controls.domain.value;
    if (domain) this.controls.url.disable();
    else this.controls.url.enable();
    this.controls.url.updateValueAndValidity();
  }

  checkUrl() {
    const url = this.object ? this.object.url : '';
    if (this.controls.url.value && (url != this.controls.url.value)) {
      this.fbConfig.getByURL(this.controls.url.value).subscribe(config => {
        if (config && (this.id || '') != this.controls.url.value) {
          this.controls.url.setErrors({exist: true});
        }
      })
    }
  }

  getConfig() {
    this.fbConfig.get(this.id).subscribe(user => {
      if (user) {
        this.object = user;
        this.setData();
      } else {
        this.router.navigate(['/configuracoes']);  
        this.utils.message('Configuração não encontrada!', 'warn');
      }
    })
  }

  getOwners() {
    this.fbConfig.all().subscribe(owners => {
      this.owners = owners.filter(owner => owner.id != this.id);
    })
  }

  setData() {
    if (this.object.image.mobile) this.mobile = {new: false, path: this.object.image.mobile};
    if (this.object.image.desktop) this.desktop = {new: false, path: this.object.image.desktop};

    this.form.get('shareMsg').setValue(this.object.shareMsg);
    this.form.get('title').setValue(this.object.title);
    this.form.get('titleFeatured').setValue(this.object.titleFeatured);
    this.form.get('url').setValue(this.object.url);
    this.form.get('domain').setValue(this.object.domain);
    this.form.get('keywords').setValue(this.object.keywords);
    this.form.get('description').setValue(this.object.description);
    this.form.get('donation').setValue(this.object.donation);
    this.form.get('pixel').setValue(this.object.pixel);
    
    if (this.storage.getUser().superUser) this.form.get('owner').setValue(this.object.owner);
  }

  async takeImageMobile(event: any) {
    const loader = this.utils.loading('Comprimindo imagem...');
    const compress = await this.utils.uploadCompress(event.addedFiles[0]);
    this.mobile = {
      new: true,
      file: compress.file,
      path: compress.base64
    };
    loader.componentInstance.msg = 'Imagem comprimida!';
    loader.componentInstance.done();
  }

  async takeImageDesktop(event: any) {
    const loader = this.utils.loading('Comprimindo imagem...');
    const compress = await this.utils.uploadCompress(event.addedFiles[0]);
    this.desktop = {
      new: true,
      file: compress.file,
      path: compress.base64
    };
    loader.componentInstance.msg = 'Imagem comprimida!';
    loader.componentInstance.done();
  }

  async saveImages(id: string) {
    if (this.mobile?.file || this.desktop?.file) {
      if (this.mobile?.new && this.mobile?.file) {
        this.object.image.mobile = await this.fbConfig.addImage(id, this.mobile.file, 'mobile');
      }

      if (this.desktop?.new && this.desktop?.file) {
        this.object.image.desktop = await this.fbConfig.addImage(id, this.desktop.file, 'desktop');
      }

      await this.fbConfig.update(id, {image: this.object.image});
    }
  }

  async deleteImageMobile() {
    if (!this.mobile.new) {
      this.utils.delete().then(async _ => {
        await this.fbConfig.deleteImage(this.object.id, 'mobile');
        this.object.image.mobile = this.mobile = null;
        await this.fbConfig.update(this.object.id, {image: this.object.image});
      }).catch(_ => {});
    } else this.mobile = null;
  }

  async deleteImageDesktop() {
    if (!this.desktop.new) {
      this.utils.delete().then(async _ => {
        await this.fbConfig.deleteImage(this.object.id, 'desktop');
        this.object.image.desktop = this.desktop = null;
        await this.fbConfig.update(this.object.id, {image: this.object.image});
      }).catch(_ => {});
    } else this.desktop = null;
  }

  shareWhatsapp() {
    const host = this.controls.domain.value || this.host;
    let msg = this.form.get('shareMsg').value.replace(/\n/gm, '%0a');
    msg += `%0a%0a`;
    msg += `${host}/${this.controls.url.value}`;
    window.open(`whatsapp://send?text=${msg}`);
  }

  async save() {
    const value = this.form.value;

    if (!value.url && !value.domain) return this.utils.message('Cadastre uma URL ou Domínio!', 'warn');

    if (this.form.valid) {
      this.saving = true;
      Object.assign(this.object, value);
      const data = JSON.parse(JSON.stringify(this.object));
      
      for (const field in data) {
        if (!data[field] && data[field] != false) data[field] = null;
        else if (data[field] instanceof Date) data[field] = data[field].toISOString();
      }

      if (this.id) {
        await this.fbConfig.update(this.id, data);
        await this.saveImages(this.id);
      } else {
        await this.fbConfig.create(data).then(async doc => {
          await this.saveImages(doc.id);
        });
      }

      this.saving = false;

      if (this.storage.getUser().superUser) this.router.navigateByUrl('/configuracoes');
      this.utils.message('Configuração salva com sucesso!', 'success');
    } else this.utils.message('Verifique os dados antes de salvar!', 'warn');
  }
}
