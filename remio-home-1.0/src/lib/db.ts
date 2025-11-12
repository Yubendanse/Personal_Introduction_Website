import { Pool } from "pg";

const globalForPg = globalThis as unknown as {
  pgPool: Pool | undefined;
};

export const pg =
  globalForPg.pgPool ||
  new Pool({
    connectionString: process.env.PG_DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
pg.on("connect", (client) => {
  client.query("SET TIME ZONE 'Asia/Shanghai';");
});

if (process.env.NODE_ENV !== "production") globalForPg.pgPool = pg;
