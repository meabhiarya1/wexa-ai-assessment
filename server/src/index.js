import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { getServerConfig } from "./config.js";
import healthRouter from "./routes/health.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();
const { port, clientOrigin } = getServerConfig();

app.use(helmet());
app.use(cors({ origin: clientOrigin }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/health", healthRouter);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`TalentGraph API listening on http://localhost:${port}`);
});
