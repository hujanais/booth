import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription, } from 'rxjs';
import { MessageModel } from 'src/app/models/message-model';
import { RoomModel } from 'src/app/models/room-model';
import { RoomUpdatedModel } from 'src/app/models/ws-models';
import { BoothApiService } from 'src/app/services/booth-api.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();

  public currentRoom: RoomModel | undefined;

  public roomTitle: string = '';
  public roomDescription: string = '';
  public messages: string[] = [];

  public errorMessage = '';
  public newMessage = '';

  constructor(private api: BoothApiService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.subscriptions.add(this.api.onRoomJoined.subscribe((room: RoomModel) => {
      this.currentRoom = { ...room };
    }));

    this.subscriptions.add(this.api.wss.roomUpdated.subscribe((resp: RoomUpdatedModel) => {
      if (!this.currentRoom) {
        // do nothing.
        return;
      }
      this.currentRoom.title = resp.room.title;
      this.currentRoom.description = resp.room.description;
      this.currentRoom.users = [...resp.room.users];
      this.currentRoom.messages = [...resp.room.messages];
    }));

    this.subscriptions.add(this.api.wss.newMessage.subscribe((resp: RoomUpdatedModel) => {
      if (!this.currentRoom) {
        console.log('we should be getting this message');
        return;
      }
      this.currentRoom.title = resp.room.title;
      this.currentRoom.description = resp.room.description;
      this.currentRoom.users = [...resp.room.users];
      this.currentRoom.messages = [...resp.room.messages];
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public doExitRoom() {
    if (!this.currentRoom || !this.currentRoom.id) {
      console.log('### doExitRoom failed');
      return;
    }

    this.api.exitRoom(this.currentRoom.id).subscribe(
      {
        next: () => {
          console.log('### exited room');
          this.currentRoom = undefined;
        },
        error: (err: HttpErrorResponse) => {
          console.log('### doExitRoom failed', `${err.status}. ${err.statusText}`);
        }
      }
    );
  }

  public sendMessage(): void {
    if (!this.currentRoom || !this.currentRoom.id) {
      console.log('fail to send');
      return;
    }

    this.api.sendMessage({ roomId: this.currentRoom?.id, message: this.newMessage }).subscribe(
      {
        next: (resp: MessageModel) => { },
        error: (err: HttpErrorResponse) => {
          console.log('### sendMessage failed', `${err.status}. ${err.statusText}`);
        }
      }
    );
    this.newMessage = '';
  }
}
