import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
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
  public title: string = 'room-title';
  public description: string = 'room-description';

  constructor(private api: BoothApiService, private fb: FormBuilder) {
    this.form = this.fb.group([
      {message: ''}
    ]);
  }

  ngOnInit(): void {
    this._subscriptions.add(
      this.api.enteredRoom.subscribe((room: RoomModel) => {
        this.enterRoom(room);
      }));

    this._subscriptions.add(
      this.api.enteredRoom.subscribe((room: RoomModel) => {
        this.exitRoom(room);
      }));

  }
  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  private enterRoom(room: RoomModel) {
    this.title = room.title;
    this.description = room.description;
  }
  
  private exitRoom(room:RoomModel) {}

}
