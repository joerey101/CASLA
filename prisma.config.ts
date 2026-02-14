import { defineConfig } from "prisma/config";

export default defineConfig({
    schema: "prisma/schema.prisma",
    datasource: {
        url: process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL || "",
    },
    migrations: {
        seed: "node scripts/seed.js",
    },
});
