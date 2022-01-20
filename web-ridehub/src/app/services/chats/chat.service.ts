import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateMessage } from 'src/app/classes/messages/create-message';
import { GetChatId } from 'src/app/interfaces/chats/get-chat-id';
import { Messages } from 'src/app/interfaces/chats/messages';
import { url } from '../../secrets';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private _http: HttpClient) { }

  getChatID(rideID: number): Observable<GetChatId> {
    return this._http.get<GetChatId>(`${url}/v1/chat/${rideID}`);
  }

  getMessages(rideID: number, chatID: string): Observable<Messages[]> {
    return this._http.get<Messages[]>(`${url}/v1/chat/${rideID}/${chatID}`);
  }

  sendMessage(data: CreateMessage){
    return this._http.post(`${url}/v1/chat/`, data);
  }
}
