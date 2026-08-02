import { Pool } from "pg";
import {
  getScoreSubmissionMode,
  submitDinoScore,
  submitDinoScoreWithSecret,
} from "./dinoRanking";

function createPool() {
  const connection = new URL(process.env.SUPABASE_POOLER_CONNECTION);
  return new Pool({
    host: connection.hostname,
    port: Number(connection.port || 5432),
    user: decodeURIComponent(connection.username),
    password: process.env.SUPABASE_DB_PASSWORD,
    database: connection.pathname.slice(1) || "postgres",
    ssl: connection.searchParams.get("sslmode") === "disable"
      ? false
      : { rejectUnauthorized: false },
    max: 3,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 5_000,
  });
}

function databasePool() {
  if (!globalThis.__dinoScorePool) {
    globalThis.__dinoScorePool = createPool();
  }
  return globalThis.__dinoScorePool;
}

export async function submitDinoScoreServer({ nickname, score }) {
  const mode = getScoreSubmissionMode();
  if (mode === "secret_key") {
    return submitDinoScoreWithSecret({ nickname, score });
  }
  if (mode === "service_role") {
    return submitDinoScore({ nickname, score });
  }
  if (mode === "database") {
    const result = await databasePool().query(
      "select public.submit_dino_score($1, $2) as result",
      [nickname, score]
    );
    return result.rows[0].result;
  }
  throw new Error("dino score submission is not configured");
}
