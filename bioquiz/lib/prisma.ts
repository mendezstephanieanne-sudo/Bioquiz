import { PrismaClient } from "@prisma/client";

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;
  const hasPlaceholder = /\[[^\]]+\]|PROJECT_REF|POOLER_HOST|DB_HOST|PASSWORD/i.test(
    databaseUrl ?? ""
  );
  const hasPostgresProtocol = /^postgres(?:ql)?:\/\//i.test(databaseUrl ?? "");

  if (!databaseUrl || hasPlaceholder || !hasPostgresProtocol) {
    throw new Error(
      "DATABASE_URL is not configured. Use the real postgresql:// Supabase database connection string from the Connect panel, not the project URL or an API key."
    );
  }

  return databaseUrl;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ datasourceUrl: getDatabaseUrl() });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}