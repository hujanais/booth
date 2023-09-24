import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { RoomModel } from 'src/app/models/room-model';
import { BoothApiService } from 'src/app/services/booth-api.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent {
  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  message: string = '';
  rooms: RoomModel[] = [];

  constructor(private api: BoothApiService) { }

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
}
