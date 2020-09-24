import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';
import { StorageService } from 'src/app/services/storage/storage.service';
import { FBAdminService } from 'src/app/services/firebase/admin/admin.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private auth: AngularFireAuth,
    private fbAdmin: FBAdminService,
    private storage: StorageService,
  ){ }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise(resolve => {
      this.auth.onAuthStateChanged(user => {
        if (user) {
          this.fbAdmin.get(user.uid).subscribe(admin => {
            if(admin){
              this.storage.setUser(admin);
              resolve(true);
            }else{
              this.auth.signOut();
            }
          })
        } else {
          this.router.navigate(['/auth/login']);
          this.storage.removeUser();
          resolve(false);
        }
      });
    });
  }
}
