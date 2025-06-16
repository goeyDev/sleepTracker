import { defineConfig } from "drizzle-kit"

export default defineConfig({
  out: "./src/drizzle/migrations",
  schema: "./src/drizzle/schema.ts",
  dialect: "postgresql",
  strict: true,
  verbose: true,
  dbCredentials: {
    password: process.env.DB_PASSWORD!,
    user: process.env.DB_USER!,
    database: process.env.DB_NAME!,
    host: process.env.DB_HOST!,
    ssl: false,
  },
})

