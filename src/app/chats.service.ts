import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase';
import { Observable } from 'rxjs';
import { Message } from './interfaces/message';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  constructor(
    private db: AngularFirestore,
  ) { }

  sendMessage(cannelId: string, comments: string, uid: string, userName: string): Promise<void> {
    const id = this.db.createId();
    const newValue: Message = {
      uid,
      comments,
      userName,
      createdAt: firestore.Timestamp.now()
    };
    return this.db.doc<Message>(`rooms/${cannelId}/messages/${id}`).set(newValue);
  }

  getLatestMessages(cannelId: string): Observable<Message[]> {
    return this.db
      .doc(`rooms/${cannelId}`)
      .collection<Message>('messages', ref => ref.orderBy('createdAt', 'desc').limit(1))
      .valueChanges();
  }

  getAllMessages(cannelId: string): Observable<Message[]> {
    return this.db
      .doc(`rooms/${cannelId}`)
      .collection<Message>('messages', ref => ref.orderBy('createdAt', 'desc').limit(30))
      .valueChanges();
  }
}
