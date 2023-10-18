import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, filter, map } from 'rxjs';
import { RoomModel } from 'src/app/models/room-model';
import { RoomChangedModel, RoomUpdatedModel } from 'src/app/models/ws-models';
import { BoothApiService } from 'src/app/services/booth-api.service';

export interface PeriodicElement {
  id: string;
  title: string;
  description: string;
  owner: string;
  numOfUsers: number;
}

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnDestroy {
  private subscriptions = new Subscription();
  columnHeaders: string[] = ['title', 'description', 'owner', 'nUsers', 'delete', 'join'];

  dataSource: MatTableDataSource<PeriodicElement> = new MatTableDataSource();

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

            this.updateTable();
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

            this.updateTable();
          },
          error: (err: HttpErrorResponse) => { }
        }
      )
    )

    this.subscriptions.add(
      this.api.wss.roomUpdated.subscribe(
        {
          next: (resp: RoomUpdatedModel) => {
            const room = this.rooms.find(r => r.id === resp.id);
            if (room) {
              room.users.length = 0;
              room.users = [...resp.users];
              room.title = resp.title;
              room.description = resp.description;
            }

            this.updateTable();
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
          this.rooms = [...rooms];
          this.updateTable();
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

  private updateTable(): void {
    const newData: PeriodicElement[] = [];
    this.dataSource.data = [];
    for (const room of this.rooms) {
      newData.push({
        id: room.id,
        title: room.title,
        description: room.description,
        owner: room.owner.username,
        numOfUsers: room.users.length
      });
    }

    this.dataSource.connect().next(newData);
  }
}
