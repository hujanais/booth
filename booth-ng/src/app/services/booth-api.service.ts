import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { CreateRoomRequest, RoomModel } from '../models/room-model';

export type LoginResponse = {
  isLoggedIn: boolean;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class BoothApiService {
  private _jwtToken: string = '';
  private loginSubject$ = new Subject<LoginResponse>();
  private joinRoomSubject$ = new Subject<RoomModel>();
  private exitRoomSubject$ = new Subject<RoomModel>();

  constructor(private http: HttpClient) {}

  public get onLogInChanged(): Observable<LoginResponse> {
    return this.loginSubject$.asObservable();
  }

  public get enteredRoom(): Observable<RoomModel> {
    return this.joinRoomSubject$.asObservable(); 
  }

  public get exitedRoom(): Observable<RoomModel> {
    return this.exitRoomSubject$.asObservable();
  }

  // return the jwttoken
  public login(username: string, password: string): Observable<string> {
    return this.http.post<string>('/api/login', {
      username, password
    }).pipe(
      tap((jwtToken) => {
        this._jwtToken = jwtToken;
        this.loginSubject$.next({
          isLoggedIn: true,
          username: username
        });
      })
    );
  }

  public getAllRooms(): Observable<RoomModel[]> {
    return this.http.get<RoomModel[]>('/api/rooms', {headers: this.headers});
  }

  public createRoom(payload: CreateRoomRequest): Observable<RoomModel> {
    return this.http.post<RoomModel>('/api/room', payload, {headers: this.headers});
  }

  public deleteRoom(roomId: string): Observable<RoomModel> {
    return this.http.delete<RoomModel>(`/api/room/${roomId}`, {headers: this.headers});
  }

  public joinRoom(roomId: string): Observable<RoomModel> {
    return this.http.post<any>(`/api/room/join/${roomId}`, null, {headers: this.headers}).pipe(
      tap((roomModel: RoomModel) => {
        this.joinRoomSubject$.next(roomModel);
      })
    );
  }

  private get headers(): HttpHeaders {
    return new HttpHeaders({'Authorization': `Bearer ${this._jwtToken}`});
  }
}
