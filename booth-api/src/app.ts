import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { jwtHandler } from './middlewares/jwt-middleware';

import express from "express";
import roomRouter from "./routes/rooms-routes";
import messageRouter from "./routes/message-routes";
import userRouter from './routes/user-routes';

const port = +(process.env.PORT || "3000");

const app = express();

app.use(cors());
app.use(jwtHandler);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", roomRouter);
app.use("/api", messageRouter);
app.use('/api', userRouter);

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});