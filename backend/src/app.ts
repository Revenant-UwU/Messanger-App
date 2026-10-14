import express, { Express, Request, Response } from "express";
import { authController } from "./controllers/auth.controller.js";
import { usersController } from "./controllers/users.controller.js";

export const app:Express = express();

app.use(express.json());


app.get("/", (req: Request, res: Response) => {
  res.send("MyMys API");
});

app.get('/api/health', (_req, res) => {
  res.json({ message: 'Backend funcionando' });
});

app.use("/auth", authController);
app.use("/users", usersController);