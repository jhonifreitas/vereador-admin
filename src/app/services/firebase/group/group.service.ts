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

  all() {
    return this.db.collection(this.collectionName).get().pipe(
      map(actions => {
        return actions.docs.map(doc => {
          if(doc.exists){
            return doc.data() as Group;
          }
        })
      })
    );
  }

  get(id: string) {
    return this.db.collection(this.collectionName).doc<Group>(id).get().pipe(
      map(action => {
        if(action.exists){
          return action.data() as Group;
        }
      })
    );
  }

  async create(data: Group) {
    return await this.db.collection<Group>(this.collectionName).add(data).then(async res => {
      await this.update(res.id, {id: res.id});
    });
  }

  update(id: string, data: Partial<Group>) {
    return this.db.collection(this.collectionName).doc<Group>(id).update(data);
  }

  delete(id: string) {
    return this.db.collection(this.collectionName).doc<Group>(id).delete();
  }
}
