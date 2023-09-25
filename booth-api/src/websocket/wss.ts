import WebSocket from 'ws';

export type WebSocketEx = WebSocket & {uid: string};

export class WSService {
    private _wss: WebSocket.Server;
    private _channels: Map<string, WebSocketEx> = new Map<string, WebSocketEx>();

    private parseUserId = (url: string): string | null=> {
        // /?uid=12345
        const matches = url.split('=');
        if (matches.length === 2) return matches[1];
        
        return null;
    }

    constructor() {
        this._wss = new WebSocket.Server({port:3001});

        this._wss.on('connection', (ws: WebSocketEx, request: any) => {
            const uId = this.parseUserId(request.url);
            if (!uId) {
                console.log('handle missing uId');
                return;
            }
            ws.uid = uId;
            this._channels.set(uId, ws);

            ws.onmessage = (event: WebSocket.MessageEvent) => {
                console.log(event.data);
                ws.send(`echo ${event.data}`)
            };

            ws.onclose = (event: WebSocket.CloseEvent) => {
                this._channels.delete(ws.uid);
            }

            // Listen for messages from the client
            // ws.on('message', (message: string) => {
            //   console.log(`Received message: ${message}`);
          
            //   // Broadcast the message to all clients
            //   const parsedMessage: Message = JSON.parse(message);
            //   this._wss.clients.forEach(client => {
            //     if (client !== ws && client.readyState === WebSocket.OPEN) {
            //       client.send(JSON.stringify(parsedMessage));
            //     }
            //   });
            // });
          
            // // Listen for WebSocket closure
            // ws.on('close', () => {
            //   console.log('WebSocket client disconnected.');
            // });
          });
    }


}