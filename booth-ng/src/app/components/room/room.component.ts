import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription, filter } from 'rxjs';
import { RoomModel } from 'src/app/models/room-model';
import { BoothApiService } from 'src/app/services/booth-api.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {

  private _subscriptions = new Subscription();

  public form: FormGroup;
  public currentRoom: RoomModel | undefined;

  public roomTitle: string = '';
  public roomDescription: string = '';

  public message = '';

  constructor(private api: BoothApiService, private fb: FormBuilder) {
    this.form = this.fb.group([
      { chat: '' }
    ]);
  }

  ngOnInit(): void {
    // const obs$2 = this.api.onChanged.subscribe(
    //   {
    //     next: (payload: ChangeModel<UserEnterExitRoomModel | RoomUpdatedModel>) => {
    //       switch (payload.changeType) {
    //         case ChangeType.RoomUpdated:
    //           const roomChangedModel = (payload.data as RoomUpdatedModel);
    //           if (this.currentRoom) {
    //             this.currentRoom.title = roomChangedModel.room.title;
    //             this.currentRoom.description = roomChangedModel.room.description;
    //             this.currentRoom.users = [...roomChangedModel.room.users];
    //           }
    //           break;
    //         case ChangeType.UserEntered:
    //           const userEnteredModel = payload.data as UserEnterExitRoomModel;
    //           this.currentRoom = { ...userEnteredModel.room };
    //           console.log('enter', userEnteredModel);
    //           break;
    //         case ChangeType.UserExited:
    //           const userExitedRoomModel = payload.data as UserEnterExitRoomModel;
    //           this.currentRoom = undefined;
    //           console.log('exit', userExitedRoomModel);
    //           break;
    //       }
    //     },
    //     error: (err: HttpErrorResponse) => { }
    //   }
    // );

    // this._subscriptions.add(obs$2);
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
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
