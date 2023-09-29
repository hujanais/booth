import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { ChangeModel } from '../models/ws-models';
import { Observable, Subject } from 'rxjs';

export class WebsocketService {
    private _webSocket$: WebSocketSubject<ChangeModel<any>> | undefined;
    private changed$: Subject<ChangeModel<any>> = new Subject<ChangeModel<any>>();

    public get onChanged(): Observable<ChangeModel<any>> {
        return this.changed$.asObservable();
    }

    public connect(url: string, jwtToken: string) {
        this._webSocket$ = webSocket<ChangeModel<any>>(`${url}?jwtToken=${jwtToken}`);

        this._webSocket$.subscribe({
            next: (payload: ChangeModel<any>) => {
                console.log('### ws -', JSON.stringify(payload));
                this.changed$.next(payload);
            },
            error: (err) => { }
        });
    }

    public close(): void {
        this._webSocket$?.complete();
    }
}