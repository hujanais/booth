import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription, } from 'rxjs';
import { MessageModel } from 'src/app/models/message-model';
import { RoomModel } from 'src/app/models/room-model';
import { RoomUpdatedModel, UserEnterExitRoomModel, MessageChangedModel } from 'src/app/models/ws-models';
import { BoothApiService } from 'src/app/services/booth-api.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();

  public form: FormGroup;
  public currentRoom: RoomModel | undefined;

  public roomTitle: string = '';
  public roomDescription: string = '';
  public messages: string[] = ['A', 'B', 'C'];

  public message = '';

  constructor(private api: BoothApiService, private fb: FormBuilder) {
    this.form = this.fb.group([
      { chat: '' }
    ]);
  }

  ngOnInit(): void {

    this.subscriptions.add(this.api.wss.userEntered.subscribe((resp: UserEnterExitRoomModel) => {
      this.currentRoom = { ...resp.room };
      this.messages.push(`${resp.user.username} has joined`);
    }));

    this.subscriptions.add(this.api.wss.userExited.subscribe((resp: UserEnterExitRoomModel) => {
      this.currentRoom = undefined;
      this.messages.length = 0;
    }));

    this.subscriptions.add(this.api.wss.roomUpdated.subscribe((resp: RoomUpdatedModel) => {
      if (this.currentRoom) {
        this.currentRoom.title = resp.room.title;
        this.currentRoom.description = resp.room.description;
        this.currentRoom.users = [...resp.room.users];
      }
    }));

    this.subscriptions.add(this.api.wss.newMessage.subscribe((resp: MessageModel) => {
      this.messages.push(`${resp.owner.username}: ${resp.message}`);
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
        },
        error: (err: HttpErrorResponse) => {
          console.log('### doExitRoom failed', `${err.status}. ${err.statusText}`);
        }
      }
    );
  }
}
