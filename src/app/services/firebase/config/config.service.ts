import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

import { Config } from 'src/app/models/config';

@Injectable({
  providedIn: 'root'
})
export class FBConfigService {

  private collectionName = '/config';

  constructor(
    private db: AngularFirestore,
    private afStorage: AngularFireStorage,
  ) { }

  all() {
    return this.db.collection(this.collectionName).get().pipe(
      map(actions => {
        return actions.docs.map(doc => {
          if(doc.exists){
            return doc.data() as Config;
          }
        })
      })
    );
  }

  get(id: string) {
    return this.db.collection(this.collectionName).doc<Config>(id).get().pipe(
      map(action => {
        if(action.exists){
          const data = action.data();
          if(!data.uid){
            data.uid = action.id;
          }
          return data as Config;
        }
      })
    );
  }

  async create(data: Config) {
    return await this.db.collection<Config>(this.collectionName).add(data).then(async doc => {
      await this.update(doc.id, {id: doc.id});
      return doc;
    });
  }

  update(id: string, data: Partial<Config>) {
    return this.db.collection(this.collectionName).doc<Config>(id).update(data);
  }

  delete(id: string) {
    return this.db.collection(this.collectionName).doc<Config>(id).delete();
  }

  // IMAGE
  async addImage(id: string, file: Blob){
    const fileName = id+'.png';
    return await this.afStorage.ref(`${this.collectionName}/${fileName}`).put(file).then(async (res) => {
      const url = await res.ref.getDownloadURL();
      await this.update(id, {image: url});
    });
  }

  async deleteImage(id: string){
    const path = `${this.collectionName}/${id}`;
    return await this.afStorage.ref(path).delete().toPromise().then(async _ => {
      await this.update(id, {image: null});
    });
  }
}
