import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { jwtHandler } from './middlewares/jwt-middleware';

import express from "express";
import SocketIo from "./websocket/socket_io";
import roomRouter from "./routes/rooms-routes";
import messageRouter from "./routes/message-routes";
import userRouter from './routes/user-routes';
import dbFactory from "./db/db-factory";

const port = +(process.env.PORT || "3000");
const app = express();

const init = async (): Promise<boolean> => {
  return dbFactory.initialize();
}

init().then((flag) => {
  app.listen(port, () => {
    console.log(`server started on port ${port}`);
  });
  
  const wssPort = 3001;
  const wsApp = express();
  const server = wsApp.listen(wssPort, () => {
    console.log(`server started on port ${wssPort}`);
  });

  // initialize the socket.io singleton class.  You are free to use anywhere now.
  const io = SocketIo.init(server);

}).catch(err => {
  console.log('server initialization failed')
})

app.use(cors());
app.use(jwtHandler);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", roomRouter);
app.use("/api", messageRouter);
app.use('/api/user', userRouter);