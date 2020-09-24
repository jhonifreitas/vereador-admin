import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Group } from 'src/app/models/group';


@Injectable({
  providedIn: 'root'
})
export class FBGroupService {

  private collectionName = '/groups';

  constructor(
    private db: AngularFirestore,
  ) { }

  get(id: string) {
    return this.db.collection(this.collectionName).doc<Group>(id).get().pipe(
      map(action => {
        if(action.exists){
          const data = action.data();
          if(!data.uid){
            data.uid = action.id;
          }
          return data as Group;
        }
      })
    );
  }
}
