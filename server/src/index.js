import "./loadEnv.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { getServerConfig } from "./config.js";
import healthRouter from "./routes/health.js";
import catalogRouter from "./routes/catalog.js";
import graphRouter from "./routes/graph.js";
import insightsRouter from "./routes/insights.js";
import pathRouter from "./routes/path.js";
import peopleRouter from "./routes/people.js";
import projectsRouter from "./routes/projects.js";
import searchRouter from "./routes/search.js";
import statsRouter from "./routes/stats.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();
const { port, clientOrigin } = getServerConfig();

app.use(helmet());
app.use(cors({ origin: clientOrigin }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/health", healthRouter);
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

app.listen(port, () => {
  console.log(`TalentGraph API listening on http://localhost:${port}`);
});
