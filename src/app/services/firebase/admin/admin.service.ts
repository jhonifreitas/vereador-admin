import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireFunctions } from '@angular/fire/functions';

import { Admin } from 'src/app/models/admin';

@Injectable({
  providedIn: 'root'
})
export class FBAdminService {

  private collectionName = '/admin';

  constructor(
    private db: AngularFirestore,
    private afStorage: AngularFireStorage,
    private functions: AngularFireFunctions
  ) { }

  all() {
    return this.db.collection(this.collectionName).get().pipe(
      map(actions => {
        return actions.docs.map(doc => {
          if(doc.exists){
            const data = doc.data();
            if(!data.uid){
              data.uid = doc.id;
            }
            return data as Admin;
          }
        })
      })
    );
  }

  get(id: string) {
    return this.db.collection(this.collectionName).doc<Admin>(id).get().pipe(
      map(action => {
        if(action.exists){
          const data = action.data();
          if(!data.uid){
            data.uid = action.id;
          }
          return data as Admin;
        }
      })
    );
  }

  create(data: Admin): Promise<{uid: string}> {
    return new Promise(async (resolve, reject) => {
      const createUser = this.functions.httpsCallable('createUser');
      const param = {
        email: data.email,
        password: data.password,
        disabled: !data.active
      }
      await createUser(param).toPromise().then(async res => {
        data.uid = res.user.uid;
        await this.db.collection<Admin>(this.collectionName).doc(res.user.uid).set(data).then(async _ => {
          resolve({uid: res.user.uid});
        }).catch(err => reject(err));
      }).catch(err => reject(err));
    })
  }

  update(id: string, data: Partial<Admin>): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const getUser = this.functions.httpsCallable('getUser');
      const param = {
        uid: id,
        email: data.email,
        password: data.password,
        disabled: !data.active
      }

      await getUser({uid: id}).toPromise().then(async user => {
        delete param.password;
        const updateUser = this.functions.httpsCallable('updateUser');
        await updateUser(param).toPromise();
      }).catch(async _ => {
        const createUser = this.functions.httpsCallable('createUser');
        await createUser(param).toPromise();
      });
      await this.db.collection(this.collectionName).doc<Admin>(id).update(data).then(_ => {
        resolve();
      }).catch(err => reject(err));
    });
  }

  delete(id: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const deleteUser = this.functions.httpsCallable('deleteUser');
      const param = {uid: id}
      await deleteUser(param).toPromise().then(async _ => {
        this.db.collection(this.collectionName).doc<Admin>(id).delete().then(_ => {
          resolve();
        }).catch(err => reject(err));
      }).catch(err => reject(err));
    });
  }

  // IMAGE
  async addImage(id: string, file: Blob){
    const fileName = id+'.png';
    return await this.afStorage.ref(`${this.collectionName}/${fileName}`).put(file).then(async (res) => {
      const url = await res.ref.getDownloadURL();
      await this.update(id, {avatar: url});
    });
  }

  async deleteImage(id: string){
    const path = `${this.collectionName}/${id}`;
    return await this.afStorage.ref(path).delete().toPromise().then(async _ => {
      await this.update(id, {avatar: null});
    });
  }
}
