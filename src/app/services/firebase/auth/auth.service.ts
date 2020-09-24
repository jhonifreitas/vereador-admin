import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";

import { Admin } from 'src/app/models/admin';
import { FBAdminService } from '../admin/admin.service';

@Injectable({
  providedIn: 'root'
})
export class FBAuthService {

  constructor(
    private auth: AngularFireAuth,
    private fbAdmin: FBAdminService
  ) { }

  signIn(email: string, password: string): Promise<Admin> {
    return new Promise((resolve, reject) => {
      this.auth.signInWithEmailAndPassword(email, password).then(_ => {
        this.fbAdmin.getByEmail(email).subscribe(user => {
          if(user){
            resolve(user);
          }else{
            this.signOut();
            reject('User not found!');
          }
        })
      }).catch(err => reject(err));
    })
  }

  signOut() {
    return this.auth.signOut();
  }
}
