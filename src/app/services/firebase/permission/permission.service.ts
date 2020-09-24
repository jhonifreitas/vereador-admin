import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Permission } from 'src/app/models/permission';


@Injectable({
  providedIn: 'root'
})
export class FBPermissionService {

  private collectionName = '/permissions';

  constructor(
    private db: AngularFirestore,
  ) { }

  all() {
    return this.db.collection(this.collectionName).get().pipe(
      map(actions => {
        return actions.docs.map(doc => {
          if(doc.exists){
            return doc.data() as Permission;
          }
        })
      })
    );
  }

  get(id: string) {
    return this.db.collection(this.collectionName).doc<Permission>(id).get().pipe(
      map(action => {
        if(action.exists){
          const data = action.data();
          if(!data.uid){
            data.uid = action.id;
          }
          return data as Permission;
        }
      })
    );
  }

  async create(data: Permission) {
    return await this.db.collection<Permission>(this.collectionName).add(data).then(async res => {
      await this.update(res.id, {id: res.id});
    });
  }

  update(id: string, data: Partial<Permission>) {
    return this.db.collection(this.collectionName).doc<Permission>(id).update(data);
  }

  delete(id: string) {
    return this.db.collection(this.collectionName).doc<Permission>(id).delete();
  }
}
