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
}
