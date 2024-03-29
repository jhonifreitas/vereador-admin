import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

import { Category } from 'src/app/models/category';


@Injectable({
  providedIn: 'root'
})
export class FBCategoryService {

  private collectionName = '/categories';

  constructor(
    private db: AngularFirestore,
    private afStorage: AngularFireStorage
  ) { }

  all() {
    return this.db.collection(this.collectionName, ref => ref.orderBy('order')).get().pipe(
      map(actions => {
        return actions.docs.map(doc => {
          if(doc.exists){
            return doc.data() as Category;
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
            return doc.data() as Category;
          }
        })
      })
    );
  }

  get(id: string) {
    return this.db.collection(this.collectionName).doc<Category>(id).get().pipe(
      map(action => {
        if(action.exists){
          const data = action.data();
          if(!data.uid){
            data.uid = action.id;
          }
          return data as Category;
        }
      })
    );
  }

  async create(data: Category) {
    return await this.db.collection<Category>(this.collectionName).add(data).then(async res => {
      await this.update(res.id, {id: res.id});
    });
  }

  update(id: string, data: Partial<Category>) {
    return this.db.collection(this.collectionName).doc<Category>(id).update(data);
  }

  delete(id: string) {
    return this.db.collection(this.collectionName).doc<Category>(id).delete();
  }

  // IMAGE
  async addImage(file: Blob): Promise<string> {
    return new Promise(resolve => {
      const fileName = `${Math.random()}.png`;
      this.afStorage.ref(`editors/${fileName}`).put(file).then(async (res) => {
        const url = await res.ref.getDownloadURL();
        resolve(url);
      });
    })
  }
}
