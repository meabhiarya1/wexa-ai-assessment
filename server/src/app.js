import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { getServerConfig } from "./config.js";
import { getReady } from "./controllers/healthController.js";
import catalogRouter from "./routes/catalog.js";
import graphRouter from "./routes/graph.js";
import healthRouter from "./routes/health.js";
import insightsRouter from "./routes/insights.js";
import pathRouter from "./routes/path.js";
import peopleRouter from "./routes/people.js";
import projectsRouter from "./routes/projects.js";
import searchRouter from "./routes/search.js";
import statsRouter from "./routes/stats.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { createRateLimiter } from "./middleware/rateLimiter.js";
import { requestId } from "./middleware/requestId.js";
import { asyncHandler } from "./utils/asyncHandler.js";

morgan.token("request-id", (req) => req.id);

export function createApp({ enableLogging = true } = {}) {
  const app = express();
  const { clientOrigin } = getServerConfig();
  const apiRateLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 300,
    keyPrefix: "api"
  });
  const expensiveGraphLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 60,
    keyPrefix: "graph"
  });

  app.set("trust proxy", 1);
  app.use(requestId);
  app.use(helmet());
  app.use(cors({ origin: clientOrigin }));
  app.use(express.json({ limit: "32kb" }));

  if (enableLogging) {
    app.use(morgan(":method :url :status :response-time ms requestId=:request-id"));
  }

  app.use("/api", apiRateLimiter);
  app.use(["/api/search", "/api/path", "/api/graph"], expensiveGraphLimiter);
  app.use("/api/health", healthRouter);
  app.get("/api/ready", asyncHandler(getReady));
  app.use("/api", catalogRouter);
  app.use("/api/stats", statsRouter);
  app.use("/api/search", searchRouter);
  app.use("/api/people", peopleRouter);
  app.use("/api/projects", projectsRouter);
  app.use("/api/insights", insightsRouter);
  app.use("/api/path", pathRouter);
  app.use("/api/graph", graphRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
