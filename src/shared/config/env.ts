import { z } from "zod";

type EnvSource = Record<string, string | undefined>;

const authEnvSchema = z.object({
  AUTH_SECRET: z.string().min(16),
  AUTH_GOOGLE_ID: z.string().min(1),
  AUTH_GOOGLE_SECRET: z.string().min(1),
});

const databaseEnvSchema = z.object({ DATABASE_URL: z.string().min(1) });

const cloudinaryEnvSchema = z.object({
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  CLOUDINARY_UPLOAD_PRESET: z.string().min(1),
});

const cronEnvSchema = z.object({ CRON_SECRET: z.string().min(32) });

const appEnvSchema = z.object({ APP_URL: z.url() });

function createEnvReader<Schema extends z.ZodType>(schema: Schema) {
  const parse = (source: EnvSource): z.infer<Schema> => {
    const parsed = schema.safeParse(source);
    if (parsed.success) return parsed.data;
    const missing = parsed.error.issues.map((issue) => issue.path.join("."));
    throw new Error(`Invalid environment variables: ${missing.join(", ")}`);
  };
  let cached: z.infer<Schema> | undefined;
  const read = (): z.infer<Schema> => {
    cached ??= parse(process.env);
    return cached;
  };
  return { parse, read };
}

const authReader = createEnvReader(authEnvSchema);
const databaseReader = createEnvReader(databaseEnvSchema);
const cloudinaryReader = createEnvReader(cloudinaryEnvSchema);
const cronReader = createEnvReader(cronEnvSchema);
const appReader = createEnvReader(appEnvSchema);

export const parseAuthEnv = authReader.parse;
export const parseDatabaseEnv = databaseReader.parse;
export const parseCloudinaryEnv = cloudinaryReader.parse;
export const parseCronEnv = cronReader.parse;
export const parseAppEnv = appReader.parse;

export const getAuthEnv = authReader.read;
export const getDatabaseEnv = databaseReader.read;
export const getCloudinaryEnv = cloudinaryReader.read;
export const getCronEnv = cronReader.read;
export const getAppEnv = appReader.read;
