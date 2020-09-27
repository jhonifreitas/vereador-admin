import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Social } from 'src/app/models/social';

@Injectable({
  providedIn: 'root'
})
export class FBSocialService {

  private collectionName = '/socials';

  constructor(
    private db: AngularFirestore,
  ) { }

  all() {
    return this.db.collection(this.collectionName).get().pipe(
      map(actions => {
        return actions.docs.map(doc => {
          if(doc.exists){
            return doc.data() as Social;
          }
        })
      })
    );
  }

  get(id: string) {
    return this.db.collection(this.collectionName).doc<Social>(id).get().pipe(
      map(action => {
        if(action.exists){
          const data = action.data();
          if(!data.uid){
            data.uid = action.id;
          }
          return data as Social;
        }
      })
    );
  }

  async create(data: Social) {
    return await this.db.collection<Social>(this.collectionName).add(data).then(async res => {
      await this.update(res.id, {id: res.id});
    });
  }

  update(id: string, data: Partial<Social>) {
    return this.db.collection(this.collectionName).doc<Social>(id).update(data);
  }

  delete(id: string) {
    return this.db.collection(this.collectionName).doc<Social>(id).delete();
  }
}
