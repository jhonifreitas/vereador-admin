import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Tab } from 'src/app/models/tab';

@Injectable({
  providedIn: 'root'
})
export class FBTabService {

  private collectionName = '/tabs';

  constructor(
    private db: AngularFirestore,
  ) { }

  all() {
    return this.db.collection(this.collectionName, ref => ref.orderBy('order')).get().pipe(
      map(actions => {
        return actions.docs.map(doc => {
          if(doc.exists){
            return doc.data() as Tab;
          }
        })
      })
    );
  }

  getByUrl(configUrl: string) {
    return this.db.collection(this.collectionName, ref => ref.where('config', '==', configUrl).orderBy('order')).get().pipe(
      map(actions => {
        return actions.docs.map(doc => {
          if(doc.exists){
            return doc.data() as Tab;
          }
        })
      })
    );
  }

  get(id: string) {
    return this.db.collection(this.collectionName).doc<Tab>(id).get().pipe(
      map(action => {
        if(action.exists){
          const data = action.data();
          if(!data.uid){
            data.uid = action.id;
          }
          return data as Tab;
        }
      })
    );
  }

  async create(data: Tab) {
    return await this.db.collection<Tab>(this.collectionName).add(data).then(async res => {
      await this.update(res.id, {id: res.id});
    });
  }

  update(id: string, data: Partial<Tab>) {
    return this.db.collection(this.collectionName).doc<Tab>(id).update(data);
  }

  delete(id: string) {
    return this.db.collection(this.collectionName).doc<Tab>(id).delete();
  }
}
