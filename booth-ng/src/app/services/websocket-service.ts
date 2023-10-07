import { Socket, io } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { ChangeType, MessageChangedModel, RoomChangedModel, RoomUpdatedModel, UserEnterExitRoomModel } from '../models/ws-models';
import { Observable, Subject } from 'rxjs';
import { MessageModel } from '../models/message-model';

export class WebsocketService {
    private socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;
    private isConnected$: Subject<boolean> = new Subject<boolean>();
    private roomAdded$: Subject<RoomChangedModel> = new Subject<RoomChangedModel>();
    private roomDeleted$: Subject<RoomChangedModel> = new Subject<RoomChangedModel>();
    private roomUpdated$: Subject<RoomUpdatedModel> = new Subject<RoomUpdatedModel>();
    private userEntered$: Subject<UserEnterExitRoomModel> = new Subject<UserEnterExitRoomModel>();
    private userExited$: Subject<UserEnterExitRoomModel> = new Subject<UserEnterExitRoomModel>();
    private newMessage$: Subject<MessageModel> = new Subject<MessageModel>();

    public connect(url: string, jwtToken: string) {
        this.socket = io(`http://localhost:3001?jwtToken=${jwtToken}`);

        this.socket.on("connect", () => {
            this.isConnected$.next(true);
        });

        this.socket.on('disconnect', () => {
            this.isConnected$.next(false);
        })

        this.socket.on(ChangeType.RoomAdded, (payload: RoomChangedModel) => {
            this.roomAdded$.next(payload);
        });

        this.socket.on(ChangeType.RoomDeleted, (payload: RoomChangedModel) => {
            this.roomDeleted$.next(payload);
        });

        this.socket.on(ChangeType.RoomUpdated, (payload: RoomUpdatedModel) => {
            this.roomUpdated$.next(payload);
        });

        this.socket.on(ChangeType.UserEntered, (payload: UserEnterExitRoomModel) => {
            this.userEntered$.next(payload);
        });

        this.socket.on(ChangeType.UserExited, (payload: UserEnterExitRoomModel) => {
            this.userExited$.next(payload);
        });

        this.socket.on(ChangeType.NewMessage, (payload: MessageModel) => {
            this.newMessage$.next(payload);
        });

    }

    public get isConnected(): Observable<boolean> {
        return this.isConnected$.asObservable();
    }

    public get roomAdded(): Observable<RoomChangedModel> {
        return this.roomAdded$.asObservable();
    }

    public get roomDeleted(): Observable<RoomChangedModel> {
        return this.roomDeleted$.asObservable();
    }

    public get roomUpdated(): Observable<RoomUpdatedModel> {
        return this.roomUpdated$.asObservable();
    }

    public get userEntered(): Observable<UserEnterExitRoomModel> {
        return this.userEntered$.asObservable();
    }

    public get userExited(): Observable<UserEnterExitRoomModel> {
        return this.userExited$.asObservable();
    }

    public get newMessage(): Observable<MessageModel> {
        return this.newMessage$.asObservable();
    }

    public close(): void {
        this.socket?.close();
    }
}