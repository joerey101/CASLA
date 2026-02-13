import { defineConfig } from "prisma/config";

// Prisma 7 configuration file
export default defineConfig({
    schema: "prisma/schema.prisma",
    datasource: {
        // We provide a fallback for the build phase to avoid validation errors
        // In production/local, it will use the real DATABASE_URL
        url: process.env.DATABASE_URL || "postgresql://unused:unused@localhost:5432/unused",
    },
});
