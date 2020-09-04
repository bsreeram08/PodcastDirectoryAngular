import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class PodcastItemsService {
  document: Observable<any>;
  constructor(public afs: AngularFirestore) {
    this.document = this.afs.collection("PodcastLinks").doc("Links").valueChanges();
  }
  getPodcastLists() {
    return this.document;
  }
}
