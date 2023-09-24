import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { CreateRoomRequest, RoomModel } from 'src/app/models/room-model';
import { BoothApiService } from 'src/app/services/booth-api.service';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent {

  form: FormGroup;
  message = '';

  constructor(private fb: FormBuilder, private api: BoothApiService) {
    this.form = this.fb.group({
      title: [''],
      description: ['']
    });
  }

  public createRoom(): void {
    const payload: CreateRoomRequest = {
      title: this.titleControl.value,
      description: this.descriptionControl.value
    };
    this.api.createRoom(payload).subscribe(
      {
        next: (room: RoomModel) => {
          this.message = `${room.title} created successfully.`;
        },
        error: (err: HttpErrorResponse) => {
          this.message = `${err.status}. ${err.statusText}`;
        }
      }
    )
  }

  private get titleControl(): AbstractControl<string> {
    return this.form.get('title')!;
  }

  private get descriptionControl(): AbstractControl<string> {
    return this.form.get('description')!;
  }
}
