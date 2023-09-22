import * as dotenv from "dotenv";
import cors from "cors";
import {errorHandler} from './middlewares/middlewares';
dotenv.config();

import express from "express";
import roomRouter from "./routes/rooms-routes";
import messageRouter from "./routes/message-routes";

const app = express();

app.use(cors());
app.use(errorHandler);
const port = +(process.env.PORT || "3000");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", roomRouter);
app.use("/api", messageRouter);

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});