import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AngularMaterialModule } from './angular-material.module';
import { LoginComponent } from './components/login/login.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { CreateRoomComponent } from './components/create-room/create-room.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input'
import { RoomComponent } from './components/room/room.component';
import { ChatBubbleComponent } from './components/chat-bubble/chat-bubble.component';
import { RegistrationComponent } from './components/registration/registration.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RoomsComponent,
    CreateRoomComponent,
    RoomComponent,
    ChatBubbleComponent,
    RegistrationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
