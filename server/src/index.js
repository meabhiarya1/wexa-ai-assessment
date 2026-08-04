import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const app = express();
const port = process.env.PORT || 8080;
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(helmet());
app.use(cors({ origin: clientOrigin }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "talentgraph-api",
    database: "pending"
  });
});

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on our end." });
});

app.listen(port, () => {
  console.log(`TalentGraph API listening on http://localhost:${port}`);
});
