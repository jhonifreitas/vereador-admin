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

  get(url: string) {
    return this.db.collection(this.collectionName).doc<Config>(url).get().pipe(
      map(action => {
        if(action.exists){
          return action.data() as Config;
        }
      })
    );
  }

  create(data: Config) {
    return this.db.collection<Config>(this.collectionName).doc(data.url).set(data);
  }

  update(url: string, data: Partial<Config>) {
    return this.db.collection(this.collectionName).doc<Config>(url).update(data);
  }

  delete(url: string) {
    return this.db.collection(this.collectionName).doc<Config>(url).delete();
  }

  // IMAGE
  async addImage(url: string, file: Blob){
    const fileName = url+'.png';
    return await this.afStorage.ref(`${this.collectionName}/${fileName}`).put(file).then(async (res) => {
      const url = await res.ref.getDownloadURL();
      await this.update(url, {image: url});
    });
  }

  async deleteImage(url: string){
    const path = `${this.collectionName}/${url}`;
    return await this.afStorage.ref(path).delete().toPromise().then(async _ => {
      await this.update(url, {image: null});
    });
  }
}
