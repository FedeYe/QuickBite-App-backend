import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute";

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connected to databse!"));

const app = express(); // create an express application
app.use(express.json());
app.use(cors());

app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "health Ok!" });
});

// app.get("/test", async (req: Request, res: Response) => {
//     res.json({message: "Hello!" });
// });
app.use("/api/my/user", myUserRoute);

app.listen(7001, () => {
  console.log("server started on localhost 7001");
});
