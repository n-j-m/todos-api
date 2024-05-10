import { Config } from "drizzle-kit";

export default {
  dialect: "sqlite",
  schema: "./src/db/schema/index.ts",
  out: "./src/db/drizzle",
} satisfies Config;
