import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CreateMessage } from 'src/app/classes/messages/create-message';
import { Messages } from 'src/app/interfaces/chats/messages';
import { ChatService } from 'src/app/services/chats/chat.service';
import { ComponentTogglerService } from 'src/app/services/component-toggler.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-ride-chat',
  templateUrl: './ride-chat.component.html',
  styleUrls: ['./ride-chat.component.scss']
})
export class RideChatComponent implements OnInit {
  constructor(
    private componentToggler: ComponentTogglerService,
    private _messages: ChatService,
    private userData: UserDataService,
    private _router: Router
  ) { }

  @Input() rideDetails;
  @ViewChild('chatwrapper') chat: ElementRef;

  chatMessages: Array<CreateMessage | Messages> = [];

  ngOnInit(): void {
    this.getChatMessages();
    this.getChatMessageTimer();
    console.log(this.chatMessages)
  }

  ngAfterViewChecked(): void {
    this.chatScrollBottom();
  }

  getChatMessages(): void {
    this._messages.getMessages(this.rideDetails.id_ride, this.rideDetails.id_chat).subscribe(
      data => {
        if (JSON.stringify(data) == JSON.stringify(this.chatMessages)) return;

        this.chatMessages = [];
        this.chatMessages.push(...data);
      },
      error => console.log(error)
    )
  }

  chatScrollBottom(): void {
    this.chat.nativeElement.scrollTop = this.chat.nativeElement.scrollHeight;
  }

  @ViewChild('rideChat') rideChat: ElementRef;
  hideChat(): void {
    this.rideChat.nativeElement.classList.remove('slide-in-bottom');
    this.rideChat.nativeElement.classList.add('slide-out-bottom');

    setTimeout(() => {
      this.componentToggler.rideChat = false;
    }, 600);
  }

  sendMessage(message): void {
    const msg = new CreateMessage(this.rideDetails.id_chat, this.rideDetails.id_ride, this.userData.user.id_utilizador, message.value);
    this._messages.sendMessage(msg).subscribe(
      data => {
        this.getChatMessages();
        this.chatScrollBottom();
        message.value = "";
        console.log(data)
      },
      error => console.log(error)
    )
  }

  getChatMessageTimer(): void {
    setInterval(_ => {
      this.getChatMessages();
    }, 4000)
  }

}
