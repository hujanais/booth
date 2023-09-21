import * as dotenv from "dotenv";
import cors from "cors";
dotenv.config();

import express from "express";
import roomRouter from "./routes/rooms-routes";

const app = express();

app.use(cors());

const port = +(process.env.PORT || "3000");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", roomRouter);

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});