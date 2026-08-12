import express from "express";
import { checksRouter } from "./routes/checks.js";
import { menuRouter } from "./routes/menu.js";
import { ordersRouter } from "./routes/orders.js";
import { partiesRouter } from "./routes/parties.js";
import { paymentsRouter } from "./routes/payments.js";
import { registerRouter } from "./routes/register.js";

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

  app.use("/api/checks", checksRouter);
  app.use("/api/menu", menuRouter);
  app.use("/api/orders", ordersRouter);
  app.use("/api/parties", partiesRouter);
  app.use("/api/payments", paymentsRouter);
  app.use("/api/register", registerRouter);

  return app;
}
