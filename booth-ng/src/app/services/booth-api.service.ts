import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap, throwError } from 'rxjs';
import { CreateRoomRequest, RoomModel } from '../models/room-model';
import { WebsocketService } from './websocket-service';
import { CreateMessageRequest, MessageModel } from '../models/message-model';

export type LoginResponse = {
  isLoggedIn: boolean;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class BoothApiService {
  private _wss: WebsocketService;
  private _jwtToken: string = '';
  private joinRoom$: Subject<RoomModel> = new Subject<RoomModel>();
  private _isConnected = false;

  constructor(private http: HttpClient) {
    this._wss = new WebsocketService();
    this._wss.isConnected.subscribe(flag => this._isConnected = flag);
  }

  public get wss(): WebsocketService {
    return this._wss;
  }

  public get onRoomJoined(): Observable<RoomModel> {
    return this.joinRoom$.asObservable();
  }

  // return the jwttoken
  public login(username: string, password: string): Observable<string> {
    if (this._isConnected) {
      return throwError(() => new Error('you are already logged in'));
    }

    return this.http.post<string>('/api/login', {
      username, password
    }).pipe(
      tap((jwtToken) => {
        this._wss.connect('ws://localhost:3001', jwtToken);
        this._jwtToken = jwtToken;
      })
    );
  }

  public getAllRooms(): Observable<RoomModel[]> {
    return this.http.get<RoomModel[]>('/api/rooms', { headers: this.headers });
  }

  public createRoom(payload: CreateRoomRequest): Observable<RoomModel> {
    return this.http.post<RoomModel>('/api/room', payload, { headers: this.headers });
  }

  public deleteRoom(roomId: string): Observable<RoomModel> {
    return this.http.delete<RoomModel>(`/api/room/${roomId}`, { headers: this.headers });
  }

  public joinRoom(roomId: string): Observable<RoomModel> {
    return this.http.post<RoomModel>(`/api/room/join/${roomId}`, null, { headers: this.headers });
  }

  public exitRoom(roomId: string): Observable<RoomModel> {
    return this.http.delete<RoomModel>(`/api/room/join/${roomId}`, { headers: this.headers });
  }

  public sendMessage(payload: CreateMessageRequest): Observable<MessageModel> {
    return this.http.post<MessageModel>('/api/message', payload, { headers: this.headers });
  }

  private get headers(): HttpHeaders {
    return new HttpHeaders({ 'Authorization': `Bearer ${this._jwtToken}` });
  }
}
