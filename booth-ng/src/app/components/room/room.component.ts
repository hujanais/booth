import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription, filter } from 'rxjs';
import { RoomModel } from 'src/app/models/room-model';
import { ChangeModel, ChangeType, RoomChangedModel, RoomUpdatedModel } from 'src/app/models/ws-models';
import { BoothApiService } from 'src/app/services/booth-api.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {

  private _subscriptions = new Subscription();

  public form: FormGroup;
  public title: string = 'room-title';
  public description: string = 'room-description';
  public message = '';

  constructor(private api: BoothApiService, private fb: FormBuilder) {
    this.form = this.fb.group([
      { chat: '' }
    ]);
  }

  ngOnInit(): void {
    // const obs$ = this.api.onChanged.pipe(
    //   filter((payload: ChangeModel<any>) => {
    //     switch (payload.changeType) {
    //       case ChangeType.RoomAdded:
    //       case ChangeType.RoomUpdated:
    //       case ChangeType.RoomDeleted:
    //         return true;
    //       default:
    //         return false;
    //     }
    //   })).subscribe(
    //     {
    //       next: (payload: ChangeModel<RoomChangedModel | RoomUpdatedModel>) => {
    //         this.message = '';
    //       },
    //       error: (err: HttpErrorResponse) => {
    //         this.message = `${err.status}. ${err.statusText}`;
    //       }
    //     }
    //   );

    const obs$2 = this.api.onEnterRoom.subscribe(
      {
        next: (room: RoomModel) => {
          this.enterRoom(room);
        },
        error: (err: HttpErrorResponse) => {
          this.message = `${err.status}. ${err.statusText}`;
        }
      }
    );

    const obs$3 = this.api.onExitRoom.subscribe(
      {
        next: (room: RoomModel) => { },
        error: (err: HttpErrorResponse) => {
          this.message = `${err.status}. ${err.statusText}`;
        }
      }
    );

    // this._subscriptions.add(obs$);
    this._subscriptions.add(obs$2);
    this._subscriptions.add(obs$3);
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  private enterRoom(room: RoomModel) {
    this.title = room.title;
    this.description = room.description;
  }

  public exitRoom() { }

}
