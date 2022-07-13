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
    return this.db.collection(this.collectionName).snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const doc = action.payload.doc;
          if(doc.exists){
            return {id: doc.id, ...doc.data() as Config} as Config;
          }
        })
      })
    );
  }

  get(id: string) {
    return this.db.collection(this.collectionName).doc<Config>(id).snapshotChanges().pipe(
      map(action => {
        return {id: action.payload.id, ...action.payload.data()} as Config;
      })
    );
  }

  getByURL(url: string) {
    return this.db.collection<Config>(
      this.collectionName, ref => ref.where('url', '==', url).limit(1)
    ).valueChanges()
      .pipe(
        map(items => {
          return items.length ? items[0] : null;
        })
      );
  }

  create(data: Config) {
    return this.db.collection<Config>(this.collectionName).add(data);
  }

  update(id: string, data: Partial<Config>) {
    return this.db.collection(this.collectionName).doc<Config>(id).update(data);
  }

  delete(id: string) {
    return this.db.collection(this.collectionName).doc<Config>(id).delete();
  }

  private getStorageUrl(id: string, filename: string) {
    return `${this.collectionName}/${id}/images/${filename}.png`;
  }

  // IMAGE
  async addImage(id: string, file: Blob, filename: string){
    const path = this.getStorageUrl(id, filename);

    return this.afStorage.ref(path).put(file).then(async (res) => {
      const url = await res.ref.getDownloadURL();
      return url;
    });
  }

  deleteImage(id: string, filename: string): Promise<void> {
    const path = this.getStorageUrl(id, filename);
    return this.afStorage.ref(path).delete().toPromise();
  }
}
