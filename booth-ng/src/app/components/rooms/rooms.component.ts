import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { Subscription, filter, map } from 'rxjs';
import { RoomModel } from 'src/app/models/room-model';
import { RoomChangedModel, RoomUpdatedModel } from 'src/app/models/ws-models';
import { BoothApiService } from 'src/app/services/booth-api.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnDestroy {
  private subscriptions = new Subscription();
  message: string = '';
  rooms: RoomModel[] = [];

  constructor(private api: BoothApiService) {

    this.subscriptions.add(
      this.api.wss.roomAdded.subscribe(
        {
          next: (resp: RoomChangedModel) => {
            if (this.rooms.length === 0) {
              this.rooms = [...this.rooms, ...resp.rooms];
            } else {
              this.rooms.push(resp.room);
            }
          },
          error: (err: HttpErrorResponse) => { }
        }
      )
    )

    this.subscriptions.add(
      this.api.wss.roomDeleted.subscribe(
        {
          next: (resp: RoomChangedModel) => {
            const idx = this.rooms.findIndex(r => r.id === resp.room.id);
            if (idx >= 0) {
              this.rooms.splice(idx, 1);
            }
          },
          error: (err: HttpErrorResponse) => { }
        }
      )
    )

    this.subscriptions.add(
      this.api.wss.roomUpdated.subscribe(
        {
          next: (resp: RoomUpdatedModel) => {
            const room = this.rooms.find(r => r.id === resp.room.id);
            if (room) {
              room.users.length = 0;
              room.users = [...resp.room.users];
              room.title = resp.room.title;
              room.description = resp.room.description;
            }
          },
          error: (err: HttpErrorResponse) => { }
        }
      )
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
          // const idx = this.rooms.findIndex(r => r.id === room.id);
          // if (idx >= 0) {
          //   this.rooms.splice(idx, 1);
          // }
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
