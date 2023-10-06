import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { Subscription, filter, map } from 'rxjs';
import { RoomModel } from 'src/app/models/room-model';
import { BoothApiService } from 'src/app/services/booth-api.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnDestroy {
  private _subscriptions = new Subscription();
  message: string = '';
  rooms: RoomModel[] = [];

  constructor(private api: BoothApiService) {
    // const obs$ = api.onChanged.pipe(
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
    //         let roomChangedModel: RoomChangedModel | RoomUpdatedModel;
    //         switch (payload.changeType) {
    //           case ChangeType.RoomAdded:
    //             roomChangedModel = payload.data as RoomChangedModel;
    //             this.rooms.push(roomChangedModel.room);
    //             break;
    //           case ChangeType.RoomDeleted:
    //             roomChangedModel = payload.data as RoomChangedModel;
    //             const idx = this.rooms.findIndex(r => r.id === roomChangedModel.room.id);
    //             if (idx > -1) {
    //               this.rooms.splice(idx, 1);
    //             }
    //             break;
    //           case ChangeType.RoomUpdated:
    //             roomChangedModel = payload.data as RoomUpdatedModel;
    //             const room = this.rooms.find(r => r.id === roomChangedModel.room.id);
    //             if (room) {
    //               room.title = roomChangedModel.room.title;
    //               room.description = roomChangedModel.room.description;
    //             }
    //             break;
    //         }
    //       },
    //       error: (err: HttpErrorResponse) => {
    //         this.message = `${err.status}. ${err.statusText}`;
    //       }
    //     }
    //   );

    // this._subscriptions.add(obs$);
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  public getAllRooms(): void {
    this.api.getAllRooms().subscribe(
      {
        next: (rooms: RoomModel[]) => {
          this.rooms.length = 0;
          for (const room of rooms) {
            this.rooms.push(room);
          }

          this.message = '';
        },
        error: (err: HttpErrorResponse) => {
          this.message = `${err.status}. ${err.statusText}`;
        }
      }
    )
  }

  public deleteRoom(roomId: string | undefined) {
    if (!roomId) return;
    this.api.deleteRoom(roomId).subscribe(
      {
        next: (room: RoomModel) => {
          const idx = this.rooms.findIndex(r => r.id === room.id);
          if (idx >= 0) {
            this.rooms.splice(idx, 1);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.message = `${err.status}. ${err.statusText}`;
        }
      }
    );
  }

  public joinRoom(roomId: string | undefined) {
    if (!roomId) return;
    this.api.joinRoom(roomId).subscribe({
      next: (room: RoomModel) => {
        console.log('### joinRoom', room)
      },
      error: (err) => {
        console.log('### joinRoom exception', err.message)
      }
    });
  }
}
