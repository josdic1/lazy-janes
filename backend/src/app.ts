import express from "express";

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

  return app;
}
