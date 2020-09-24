import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { UtilsService } from 'src/app/services/utils/utils.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { FBAuthService } from 'src/app/services/firebase/auth/auth.service';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthFormPage implements OnInit {

  hide = true;
  loading = false;
  form: FormGroup;

  constructor(
    private router: Router,
    private utils: UtilsService,
    private fbAuth: FBAuthService,
    private formGroup: FormBuilder,
    private storage: StorageService,
  ) {
    this.form = this.formGroup.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void { }

  async auth() {
    if(this.form.valid){
      this.loading = true;
      const data = this.form.value;
      await this.fbAuth.signIn(data.email, data.password).then(res => {
        this.storage.setUser(res);
        this.router.navigate(['/']);
      }).catch(err => {
        console.log(err)
        this.utils.message('E-mail ou senha inválido!', 'warn');
      });
      this.loading = false;
    }else{
      this.utils.message('Verifique os dados antes de salvar!', 'warn');
    }
  }
}
