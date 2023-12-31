import { Socket, io } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { Observable, Subject } from 'rxjs';
import { RoomChangedModel, RoomUpdatedModel, ChangeType } from '../Models/ws-models';

export class WssService {
    private socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;
    private isConnected$: Subject<boolean> = new Subject<boolean>();
    private roomAdded$: Subject<RoomChangedModel> = new Subject<RoomChangedModel>();
    private roomDeleted$: Subject<RoomChangedModel> = new Subject<RoomChangedModel>();
    private roomUpdated$: Subject<RoomUpdatedModel> = new Subject<RoomUpdatedModel>();
    private newMessage$: Subject<RoomUpdatedModel> = new Subject<RoomUpdatedModel>();

    public connect(wssUrl: string, jwtToken: string) {
        this.socket = io(`${wssUrl}?jwtToken=${jwtToken}`);

        this.socket.on("connect", () => {
            this.isConnected$.next(true);
        });

        this.socket.on('disconnect', () => {
            this.isConnected$.next(false);
            this.socket?.close();
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

        this.socket.on(ChangeType.NewMessage, (payload: RoomUpdatedModel) => {
            this.newMessage$.next(payload);
        })
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

    public get newMessage(): Observable<RoomUpdatedModel> {
        return this.newMessage$.asObservable();
    }

    public close(): void {
        this.socket?.close();
    }
}