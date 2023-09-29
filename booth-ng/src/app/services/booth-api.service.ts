import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ObservableNotification, Subject, catchError, of, switchMap, tap } from 'rxjs';
import { CreateRoomRequest, RoomModel } from '../models/room-model';
import { WebsocketService } from './websocket-service';
import { ChangeModel, ChangeType } from '../models/ws-models';

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
  private loginSubject$ = new Subject<LoginResponse>();
  private enterRoomSubject$ = new Subject<RoomModel>();
  private exitRoomSubject$ = new Subject<RoomModel>();

  constructor(private http: HttpClient) {
    this._wss = new WebsocketService();
  }

  public get onChanged(): Observable<ChangeModel<any>> {
    return this._wss.onChanged;
  }

  public get onLogInChanged(): Observable<LoginResponse> {
    return this.loginSubject$.asObservable();
  }

  public get onEnterRoom(): Observable<RoomModel> {
    return this.enterRoomSubject$.asObservable();
  }

  public get onExitRoom(): Observable<RoomModel> {
    return this.enterRoomSubject$.asObservable();
  }

  // return the jwttoken
  public login(username: string, password: string): Observable<string> {
    return this.http.post<string>('/api/login', {
      username, password
    }).pipe(
      tap((jwtToken) => {
        this._wss.connect('ws://localhost:3001', jwtToken);
        this._jwtToken = jwtToken;
        this.loginSubject$.next({
          isLoggedIn: true,
          username: username
        });
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

  public joinRoom(roomId: string): Observable<boolean> {
    return this.http.post<any>(`/api/room/join/${roomId}`, null, { headers: this.headers }).pipe(
      switchMap((room: RoomModel) => {
        console.log(room);
        this.enterRoomSubject$.next(room);
        return of(true)
      }),
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        return of(false)
      }))
  }

  public exitRoom(roomId: string): Observable<boolean> {
    return this.http.delete<any>(`/api/room/join/${roomId}`, { headers: this.headers }).pipe(
      switchMap((room: RoomModel) => {
        console.log(room);
        this.exitRoomSubject$.next(room);
        return of(true)
      }),
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        return of(false)
      }))
  }

  private get headers(): HttpHeaders {
    return new HttpHeaders({ 'Authorization': `Bearer ${this._jwtToken}` });
  }
}
