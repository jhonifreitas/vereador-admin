import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Tab } from 'src/app/models/tab';
import { Config } from 'src/app/models/config';
import { Global } from 'src/app/models/global';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { FBTabService } from 'src/app/services/firebase/tab/tab.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { FBConfigService } from 'src/app/services/firebase/config/config.service';

@Component({
  selector: 'app-tab-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class TabFormPage implements OnInit {

  private id: string;

  object: Tab;
  saving = false;
  form: FormGroup;
  configs: Config[];
  isSuperUser: boolean;

  constructor(
    private router: Router,
    private global: Global,
    private utils: UtilsService,
    private fbTab: FBTabService,
    private formGroup: FormBuilder,
    private storage: StorageService,
    private fbConfig: FBConfigService,
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
      this.getTab();
    }
  }

  setData() {
    this.form.get('config').setValue(this.object.config);
    this.form.get('name').setValue(this.object.name);
    this.form.get('text').setValue(this.object.text);
  }

  getConfigs() {
    this.fbConfig.all().subscribe(configs => {
      this.configs = configs;
    })
  }

  getTab() {
    this.fbTab.get(this.id).subscribe(category => {
      if(category){
        this.object = category;
        this.setData();
      }else{
        this.router.navigate(['/abas']);  
        this.utils.message('Aba não encontrada!', 'warn');
      }
    })
  }

  async save() {
    if(this.form.valid){
      this.saving = true;
      const data = this.form.value;
      if(this.id){
        await this.fbTab.update(this.id, data);
      }else{
        await this.fbTab.create(data);
      }
      this.saving = false;
      this.utils.message('Aba salva com sucesso!', 'success');
      this.router.navigateByUrl('/abas');
    }else{
      this.utils.message('Verifique os dados antes de salvar!', 'warn');
    }
  }
}
