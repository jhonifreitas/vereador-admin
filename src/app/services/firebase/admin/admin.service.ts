import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

import { Admin } from 'src/app/models/admin';


@Injectable({
  providedIn: 'root'
})
export class FBAdminService {

  private collectionName = '/admin';

  constructor(
    private db: AngularFirestore,
    private afStorage: AngularFireStorage,
  ) { }

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

  getByEmail(email: string) {
    return this.db.collection(
      this.collectionName, ref => ref.where('email', '==', email).where('active', '==', true).limit(1)
    ).get().pipe(
      map(actions => {
        const action = actions.docs[0];
        if(action){
          const data = action.data();
          if(!data.uid){
            data.uid = action.id;
          }
          return data as Admin;
        }
      })
    );
  }

  async create(data: Admin) {
    return await this.db.collection<Admin>(this.collectionName).add(data);
  }

  update(id: string, data: Partial<Admin>) {
    return this.db.collection(this.collectionName).doc<Admin>(id).update(data);
  }
}
