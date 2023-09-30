import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription, filter } from 'rxjs';
import { RoomModel } from 'src/app/models/room-model';
import { ChangeModel, ChangeType, RoomChangedModel, RoomUpdatedModel, UserEnterExitRoomModel } from 'src/app/models/ws-models';
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
  public message = '';

  constructor(private api: BoothApiService, private fb: FormBuilder) {
    this.form = this.fb.group([
      { chat: '' }
    ]);
  }

  ngOnInit(): void {
    const obs$2 = this.api.onChanged.subscribe(
      {
        next: (payload: ChangeModel<UserEnterExitRoomModel>) => {
          if (payload.changeType === ChangeType.UserEntered) {
            console.log('enter', payload.data);
          } else if (payload.changeType === ChangeType.UserExited) {
            console.log('exit', payload.data);
          }
        },
        error: (err: HttpErrorResponse) => { }
      }
    );

    this._subscriptions.add(obs$2);
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
