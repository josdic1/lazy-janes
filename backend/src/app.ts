import express from "express";
import { menuRouter } from "./routes/menu.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(express.json());

  app.get("/health", (_request, response) => {
    response.status(200).json({
      service: "lazy-janes-backend",
      status: "ok",
    });
  });

  app.use("/api/menu", menuRouter);

  return app;
}
